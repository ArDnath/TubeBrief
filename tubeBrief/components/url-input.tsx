"use client";
import { useState, useRef } from "react";

interface UrlInputProps {
  onSummary: (text: string) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string) => void;
}

export default function UrlInput({
  onSummary,
  onLoading,
  onError,
}: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onLoading(true);
    onError("");
    onSummary("");
    try {
      const response = await fetch(
        `https://your-api-worker.workers.dev/?url=${encodeURIComponent(url)}`,
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch transcript");
      }
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No readable stream available");
      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        onSummary(accumulated);
      }
    } catch (err: any) {
      onError(err.message);
    } finally {
      onLoading(false);
    }
  };

  const isValid = url.trim().length > 0;

  return (
    <form onSubmit={handleSummarize} className="space-y-6 p-6">
      {/* Input wrapper */}
      <div className="relative group">
        {/* Hacky Label */}
        <label className="font-mono-hack mb-2 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Source_URL:
        </label>

        <div className="relative">
          {/* YouTube icon on left */}
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 z-10"
            style={{ opacity: focused || isValid ? 1 : 0.3 }}
          >
            <svg
              className={`h-4 w-4 transition-colors ${focused ? "fill-red-600" : "fill-gray-600"}`}
              viewBox="0 0 24 24"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>

          <input
            ref={inputRef}
            type="url"
            placeholder="ENTER_VIDEO_LINK_HERE..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="font-mono-hack w-full border-2 border-black bg-white py-4 pl-12 pr-4 text-xs font-medium outline-none transition-all placeholder:text-gray-300"
            style={{
              boxShadow: focused
                ? "4px 4px 0px 0px #ff0000"
                : "4px 4px 0px 0px #000",
            }}
          />
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!isValid}
        className="group relative w-full border-2 border-black bg-black py-4 text-xs font-bold transition-all hover:bg-white hover:text-black disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed"
      >
        <span className="font-mono-hack relative z-10 flex items-center justify-center gap-3 uppercase tracking-[0.2em]">
          {isValid ? (
            <>
              <span className="animate-pulse">▶</span>
              Run_Protocol(Summarize)
            </>
          ) : (
            "Ready_For_Input"
          )}
        </span>
      </button>

      {/* System Status / Hint */}
      <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-4">
        <p className="font-mono-hack text-[9px] text-gray-400 uppercase tracking-tighter">
          Supported: youtube.com/*, youtu.be/*
        </p>
        <div className="flex gap-1">
          <div className="h-1 w-4 bg-gray-200" />
          <div className="h-1 w-4 bg-gray-200" />
          <div
            className={`h-1 w-4 ${isValid ? "bg-red-500" : "bg-gray-200"}`}
          />
        </div>
      </div>
    </form>
  );
}
