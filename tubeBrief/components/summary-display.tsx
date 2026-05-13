"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface SummaryDisplayProps {
  summary: string;
  isLoading: boolean;
  onNew: () => void;
}

export default function SummaryDisplay({
  summary,
  isLoading,
  onNew,
}: SummaryDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ animation: "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both" }}>
      {/* Summary card */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background:
            "linear-gradient(160deg, rgba(26,18,8,0.92) 0%, rgba(12,12,14,0.95) 100%)",
          border: "1px solid rgba(217,119,6,0.18)",
          boxShadow:
            "0 0 40px rgba(217,119,6,0.08), 0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Loading progress sweep */}
        {isLoading && (
          <div
            className="animate-shimmer-sweep absolute top-0 left-0 right-0 h-[2px]"
            style={{ zIndex: 10 }}
          />
        )}

        {/* Top bar — editorial header */}
        <div
          className="flex items-center justify-between px-7 py-4"
          style={{ borderBottom: "1px solid rgba(240,232,216,0.05)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: isLoading ? "#d97706" : "rgba(217,119,6,0.4)",
                boxShadow: isLoading ? "0 0 6px rgba(217,119,6,0.8)" : "none",
                transition: "all 0.3s",
              }}
            />
            <span
              className="font-mono-dm text-xs uppercase tracking-[0.18em]"
              style={{ color: "rgba(240,232,216,0.3)" }}
            >
              {isLoading ? "Processing stream" : "Summary ready"}
            </span>
          </div>

          {!isLoading && (
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: `rgba(217,119,6,${0.2 + i * 0.15})` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content area */}
        <div
          className="px-7 py-7 max-h-[60vh] overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(217,119,6,0.2) transparent",
          }}
        >
          <div
            style={{
              color: "rgba(240,232,216,0.88)",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.05rem",
              lineHeight: "1.8",
            }}
          >
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.7rem",
                      fontWeight: 300,
                      fontStyle: "italic",
                      color: "rgba(240,232,216,0.95)",
                      marginBottom: "1rem",
                      marginTop: 0,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.65rem",
                      fontWeight: 400,
                      textTransform: "uppercase",
                      letterSpacing: "0.22em",
                      color: "rgba(217,119,6,0.75)",
                      marginTop: "2rem",
                      marginBottom: "0.6rem",
                    }}
                  >
                    — {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.15rem",
                      fontWeight: 600,
                      color: "rgba(240,232,216,0.9)",
                      marginTop: "1.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p
                    style={{
                      marginBottom: "1.1rem",
                      color: "rgba(240,232,216,0.78)",
                      lineHeight: "1.85",
                    }}
                  >
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul style={{ marginBottom: "1rem", paddingLeft: "0" }}>
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.6rem",
                      marginBottom: "0.55rem",
                      color: "rgba(240,232,216,0.75)",
                      lineHeight: "1.75",
                      listStyle: "none",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(217,119,6,0.7)",
                        marginTop: "0.55rem",
                        flexShrink: 0,
                        fontSize: "0.4rem",
                      }}
                    >
                      ◆
                    </span>
                    <span>{children}</span>
                  </li>
                ),
                strong: ({ children }) => (
                  <strong
                    style={{ color: "rgba(240,232,216,0.95)", fontWeight: 600 }}
                  >
                    {children}
                  </strong>
                ),
                blockquote: ({ children }) => (
                  <blockquote
                    style={{
                      borderLeft: "2px solid rgba(217,119,6,0.4)",
                      paddingLeft: "1.2rem",
                      margin: "1.5rem 0",
                      fontStyle: "italic",
                      color: "rgba(240,232,216,0.6)",
                    }}
                  >
                    {children}
                  </blockquote>
                ),
              }}
            >
              {summary}
            </ReactMarkdown>

            {/* Blinking cursor while streaming */}
            {isLoading && (
              <span
                style={{
                  display: "inline-block",
                  width: "2px",
                  height: "1.1em",
                  background: "rgba(217,119,6,0.9)",
                  marginLeft: "3px",
                  verticalAlign: "text-bottom",
                  animation: "pulse 1s ease-in-out infinite",
                }}
              />
            )}
          </div>
        </div>

        {/* Subtle bottom fade for scrollable content */}
        <div
          className="pointer-events-none absolute bottom-[72px] left-0 right-0 h-8"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(12,12,14,0.6))",
          }}
        />
      </div>

      {/* Actions */}
      <div className="mt-5 flex items-center gap-3">
        {!isLoading && (
          <button
            onClick={handleCopy}
            className="font-mono-dm group flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-xs uppercase tracking-widest transition-all duration-300"
            style={{
              background: "rgba(240,232,216,0.04)",
              border: "1px solid rgba(240,232,216,0.1)",
              color: copied ? "rgba(217,119,6,0.9)" : "rgba(240,232,216,0.45)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "rgba(217,119,6,0.3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "rgba(240,232,216,0.1)")
            }
          >
            {copied ? (
              <>
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </>
            )}
          </button>
        )}

        <button
          onClick={onNew}
          className="font-mono-dm group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl py-3.5 text-xs uppercase tracking-widest transition-all duration-300"
          style={
            isLoading
              ? {
                  background: "rgba(240,232,216,0.04)",
                  border: "1px solid rgba(240,232,216,0.08)",
                  color: "rgba(240,232,216,0.3)",
                }
              : {
                  background:
                    "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                  border: "1px solid rgba(217,119,6,0.5)",
                  color: "#0c0c0e",
                  boxShadow: "0 4px 20px rgba(217,119,6,0.2)",
                }
          }
        >
          {!isLoading && (
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
              }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {isLoading ? (
              <>
                <svg
                  className="h-3 w-3 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" d="M12 3a9 9 0 1 0 9 9" />
                </svg>
                Summarizing
              </>
            ) : (
              <>
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
