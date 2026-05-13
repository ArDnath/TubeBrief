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
    <form onSubmit={handleSummarize} className="space-y-4">
      {/* Input wrapper */}
      <div className="relative">
        {/* Glow ring on focus */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-500"
          style={{
            opacity: focused ? 1 : 0,
            boxShadow:
              "0 0 0 1px rgba(217,119,6,0.5), 0 0 28px rgba(217,119,6,0.12)",
            borderRadius: "12px",
          }}
        />

        {/* YouTube icon on left */}
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 transition-opacity duration-300"
          style={{ opacity: focused || isValid ? 0.7 : 0.3 }}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="rgba(217,119,6,0.9)"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="font-mono-dm w-full rounded-xl py-4 pl-11 pr-4 text-sm outline-none transition-all duration-300 placeholder:text-[rgba(240,232,216,0.2)]"
          style={{
            background: focused ? "rgba(26,18,8,0.85)" : "rgba(18,14,6,0.7)",
            border: `1px solid ${focused ? "rgba(217,119,6,0.4)" : "rgba(240,232,216,0.08)"}`,
            color: "rgba(240,232,216,0.9)",
            letterSpacing: "0.01em",
          }}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!isValid}
        className="group relative w-full overflow-hidden rounded-xl py-4 text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed"
        style={{
          background: isValid
            ? "linear-gradient(135deg, #d97706 0%, #b45309 100%)"
            : "rgba(240,232,216,0.05)",
          color: isValid ? "#0c0c0e" : "rgba(240,232,216,0.2)",
          border: `1px solid ${isValid ? "rgba(217,119,6,0.6)" : "rgba(240,232,216,0.06)"}`,
          boxShadow: isValid
            ? "0 4px 24px rgba(217,119,6,0.25), inset 0 1px 0 rgba(255,255,255,0.15)"
            : "none",
          letterSpacing: "0.08em",
        }}
      >
        {/* Shimmer overlay on hover */}
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
          }}
        />

        <span className="font-mono-dm relative z-10 flex items-center justify-center gap-2 uppercase tracking-widest">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Summarize
        </span>
      </button>

      {/* Hint */}
      <p
        className="font-mono-dm text-center text-xs"
        style={{ color: "rgba(240,232,216,0.2)", letterSpacing: "0.1em" }}
      >
        supports youtube.com &amp; youtu.be links
      </p>
    </form>
  );
}
