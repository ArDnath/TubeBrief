"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import UrlInput from "@/components/url-input";
import SummaryDisplay from "@/components/summary-display";

export default function Page() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');

        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-mono-dm { font-family: 'DM Mono', monospace; }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes shimmer-sweep {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.08); }
        }

        .animate-float-slow { animation: float-slow 7s ease-in-out infinite; }
        .animate-shimmer-sweep {
          background: linear-gradient(90deg, transparent 0%, rgba(217,119,6,0.4) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer-sweep 2.2s linear infinite;
        }
        .animate-fade-up { animation: fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .animate-pulse-ring { animation: pulse-ring 3s ease-in-out infinite; }

        .grain::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.35;
        }

        .glow-amber {
          box-shadow: 0 0 40px rgba(217,119,6,0.15), 0 0 80px rgba(217,119,6,0.06);
        }
        .glow-amber-sm {
          box-shadow: 0 0 20px rgba(217,119,6,0.2);
        }
        .text-amber-glow {
          text-shadow: 0 0 30px rgba(217,119,6,0.4);
        }
        .border-amber-dim {
          border-color: rgba(217,119,6,0.25);
        }
      `}</style>

      <main
        className="grain relative min-h-screen overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #1a1208 0%, #0c0c0e 55%, #080809 100%)",
        }}
      >
        {/* Background decorative orbs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div
            className="animate-pulse-ring absolute -top-32 -left-32 h-96 w-96 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)",
            }}
          />
          <div
            className="animate-pulse-ring absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full"
            style={{
              animationDelay: "1.5s",
              background:
                "radial-gradient(circle, rgba(217,119,6,0.05) 0%, transparent 70%)",
            }}
          />
          {/* Film strip decoration — left edge */}
          <div
            className="absolute left-0 top-0 h-full w-px"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(217,119,6,0.2) 30%, rgba(217,119,6,0.2) 70%, transparent)",
            }}
          />
          {/* Horizontal rule lines */}
          <div
            className="absolute top-[22%] left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(217,119,6,0.08) 20%, rgba(217,119,6,0.08) 80%, transparent)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
          <div className="w-full max-w-xl">
            {/* Header */}
            <header className="animate-fade-up mb-14 text-center">
              {/* Icon mark */}
              <div className="relative mx-auto mb-7 flex h-14 w-14 items-center justify-center">
                <div
                  className="animate-pulse-ring absolute inset-0 rounded-xl"
                  style={{
                    background: "rgba(217,119,6,0.1)",
                    border: "1px solid rgba(217,119,6,0.3)",
                  }}
                />
                <svg
                  className="relative z-10 h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(217,119,6,0.9)"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h1
                className="font-display text-amber-glow mb-2 text-6xl font-light italic tracking-wide"
                style={{ color: "#f0e8d8" }}
              >
                summarize
              </h1>

              {/* Amber rule */}
              <div
                className="mx-auto mb-4 flex items-center gap-3"
                style={{ width: "fit-content" }}
              >
                <div
                  className="h-px w-12"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, rgba(217,119,6,0.6))",
                  }}
                />
                <div
                  className="h-1 w-1 rounded-full"
                  style={{ background: "rgba(217,119,6,0.7)" }}
                />
                <div
                  className="h-px w-12"
                  style={{
                    background:
                      "linear-gradient(to left, transparent, rgba(217,119,6,0.6))",
                  }}
                />
              </div>

              <p
                className="font-mono-dm text-xs font-light tracking-[0.2em] uppercase"
                style={{ color: "rgba(240,232,216,0.35)" }}
              >
                Transform videos into readable intelligence
              </p>
            </header>

            {/* Main card area */}
            <div
              className="animate-fade-up"
              style={{ animationDelay: "0.15s" }}
            >
              {!summary && !loading ? (
                <UrlInput
                  onSummary={setSummary}
                  onLoading={setLoading}
                  onError={setError}
                />
              ) : (
                <SummaryDisplay
                  summary={summary}
                  isLoading={loading}
                  onNew={() => {
                    setSummary("");
                    setError("");
                    setLoading(false);
                  }}
                />
              )}
            </div>

            {/* Error */}
            {error && (
              <div
                className="animate-fade-up mt-5 rounded-lg border px-5 py-4"
                style={{
                  borderColor: "rgba(239,68,68,0.25)",
                  background: "rgba(239,68,68,0.06)",
                }}
              >
                <p
                  className="font-mono-dm text-xs"
                  style={{ color: "rgba(252,165,165,0.9)" }}
                >
                  ⚠ {error}
                </p>
              </div>
            )}

            {/* Footer */}
            <p
              className="font-mono-dm mt-14 text-center text-xs"
              style={{
                color: "rgba(240,232,216,0.18)",
                letterSpacing: "0.12em",
              }}
            >
              paste · process · read
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
