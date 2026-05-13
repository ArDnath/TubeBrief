"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { HologramShaders } from "@/components/ui/hologram";
import UrlInput from "@/components/url-input";
import SummaryDisplay from "@/components/summary-display";

export default function Page() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Micro-interaction states
  const [logoGlitch, setLogoGlitch] = useState(false);
  const [titleGlitch, setTitleGlitch] = useState(false);
  const [titleLetters, setTitleLetters] = useState("TubeBrief");
  const [logoTilt, setLogoTilt] = useState({ x: 0, y: 0 });
  const [cornerPulse, setCornerPulse] = useState(false);
  const [dotClicks, setDotClicks] = useState(0);
  const [statusText, setStatusText] = useState("Live_Node");
  const glitchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const GLITCH_CHARS = "!@#$%^&*<>?/|\\[]{}~`";
  const ORIGINAL_TITLE = "TubeBrief";

  // Glitch the title letters on hover
  const startTitleGlitch = () => {
    setTitleGlitch(true);
    let iterations = 0;
    const maxIterations = 18;

    if (glitchIntervalRef.current) clearInterval(glitchIntervalRef.current);

    glitchIntervalRef.current = setInterval(() => {
      setTitleLetters(
        ORIGINAL_TITLE.split("")
          .map((char, i) => {
            if (i < iterations / 2) return ORIGINAL_TITLE[i];
            return Math.random() > 0.5
              ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
              : char;
          })
          .join(""),
      );

      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(glitchIntervalRef.current!);
        setTitleLetters(ORIGINAL_TITLE);
        setTitleGlitch(false);
      }
    }, 50);
  };

  // 3D tilt on logo hover
  const handleLogoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = ((e.clientX - cx) / (rect.width / 2)) * 15;
    const dy = ((e.clientY - cy) / (rect.height / 2)) * -15;
    setLogoTilt({ x: dx, y: dy });
  };

  const handleLogoMouseLeave = () => {
    setLogoTilt({ x: 0, y: 0 });
    setLogoGlitch(false);
  };

  const handleLogoClick = () => {
    setLogoGlitch(true);
    setTimeout(() => setLogoGlitch(false), 600);
  };

  // Corner pulse on card hover
  const handleCardMouseEnter = () => setCornerPulse(true);
  const handleCardMouseLeave = () => setCornerPulse(false);

  // Easter egg on status dot click
  const handleDotClick = () => {
    const next = dotClicks + 1;
    setDotClicks(next);
    const messages = [
      "Live_Node",
      "Ping: 2ms",
      "All_Systems_GO",
      "👾 Hello!",
      "Uptime: 99.9%",
      "Live_Node",
    ];
    setStatusText(messages[next % messages.length]);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-fuchsia-500 font-sans selection:bg-red-500/30">
      {/* Background Shader */}
      <div className="absolute inset-0 z-0">
        <HologramShaders
          speed={0.7}
          intensity={1.1}
          stability={0.9}
          scanlines={1.2}
          prismatic={1.0}
          className="opacity-50"
        />
      </div>

      {/* Scanline Overlay */}
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        <div className="h-[200%] w-full animate-[scanline_10s_linear_infinite] bg-gradient-to-b from-transparent via-red-500/5 to-transparent" />
      </div>

      {/* Sidebar */}
      <div className="pointer-events-none fixed left-0 top-0 z-20 hidden h-full w-12 flex-col items-center border-r border-white/5 bg-black/40 py-6 backdrop-blur-md md:flex">
        <div className="mb-6 h-2 w-2 animate-pulse rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 [writing-mode:vertical-lr]">
          TubeBrief // Protocol_v1.0.4
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <header
            ref={headerRef}
            className="group mb-12 text-center cursor-default"
          >
            {/* Logo with 3D tilt + glitch on click */}
            <div
              className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center transition-all duration-500 cursor-pointer"
              style={{
                transform: `perspective(300px) rotateX(${logoTilt.y}deg) rotateY(${logoTilt.x}deg)`,
                transition:
                  logoTilt.x === 0 && logoTilt.y === 0
                    ? "transform 0.5s ease"
                    : "transform 0.05s ease",
              }}
              onMouseMove={handleLogoMouseMove}
              onMouseLeave={handleLogoMouseLeave}
              onClick={handleLogoClick}
            >
              <div className="absolute inset-0 rounded-2xl border border-white/10 animate-[spin_20s_linear_infinite]" />

              {/* Glitch clone layers */}
              {logoGlitch && (
                <>
                  <Image
                    src="/TubeBrief.png"
                    alt=""
                    width={56}
                    height={56}
                    aria-hidden
                    className="absolute z-10 rounded-sm opacity-70 animate-[glitch-r_0.3s_steps(2)_infinite]"
                    style={{
                      filter: "hue-rotate(90deg) saturate(3)",
                      transform: "translate(3px, -2px)",
                    }}
                  />
                  <Image
                    src="/TubeBrief.png"
                    alt=""
                    width={56}
                    height={56}
                    aria-hidden
                    className="absolute z-10 rounded-sm opacity-70 animate-[glitch-l_0.3s_steps(2)_infinite]"
                    style={{
                      filter: "hue-rotate(200deg) saturate(3)",
                      transform: "translate(-3px, 2px)",
                    }}
                  />
                </>
              )}

              <Image
                src="/TubeBrief.png"
                alt="TubeBrief"
                width={56}
                height={56}
                className={`relative z-10 rounded-sm transition-all duration-150 ${logoGlitch ? "opacity-80" : ""}`}
              />
            </div>

            {/* Title with per-letter glitch on hover */}
            <h1
              className={`font-mono-hack text-4xl font-bold tracking-tighter text-white sm:text-5xl cursor-pointer select-none transition-all duration-100 ${titleGlitch ? "text-shadow-glitch" : ""}`}
              onMouseEnter={startTitleGlitch}
              title="TubeBrief"
            >
              {titleLetters.split("").map((char, i) => (
                <span
                  key={i}
                  className="inline-block transition-all duration-75"
                  style={{
                    color:
                      titleGlitch && Math.random() > 0.7
                        ? "#ef4444"
                        : undefined,
                    transform:
                      titleGlitch && char !== ORIGINAL_TITLE[i]
                        ? `translateY(${(Math.random() - 0.5) * 4}px)`
                        : undefined,
                  }}
                >
                  {char}
                </span>
              ))}
            </h1>

            <p className="mt-4 font-mono-hack text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
              Neural Processor v2.2
            </p>

            <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">
              Summarise and get insights on YouTube videos instantly.
            </p>
          </header>

          {/* Input Container */}
          <div
            className="relative"
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
          >
            {/* Decorative Corners — pulse red on hover */}
            <div
              className={`absolute -left-1 -top-1 h-6 w-6 border-l-2 border-t-2 transition-all duration-300 ${
                cornerPulse
                  ? "border-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]"
                  : "border-red-600"
              }`}
            />
            <div
              className={`absolute -bottom-1 -right-1 h-6 w-6 border-b-2 border-r-2 transition-all duration-300 ${
                cornerPulse
                  ? "border-white/60 shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                  : "border-white/30"
              }`}
            />

            <Card className="overflow-hidden rounded-none border border-white/10 bg-white/[0.03] p-1 shadow-2xl backdrop-blur-xl">
              {!summary && !loading ? (
                <div className="bg-stone-50">
                  <UrlInput
                    onSummary={setSummary}
                    onLoading={setLoading}
                    onError={setError}
                  />
                </div>
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
            </Card>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mt-6 animate-in fade-in slide-in-from-top-1 border-l-2 border-red-500 bg-red-500/10 p-4 font-mono text-[11px] text-red-400 backdrop-blur-md">
              <span className="font-bold uppercase underline">
                System_Fault:
              </span>{" "}
              {error}
            </div>
          )}

          {/* Footer */}
          <footer className="mt-20 flex flex-col items-center gap-6 opacity-40 transition-opacity hover:opacity-100">
            <div className="flex gap-8 font-mono text-[10px] font-medium uppercase tracking-widest text-white/60">
              {/* Clickable status dot easter egg */}
              <div
                className="flex items-center gap-2 cursor-pointer select-none transition-all duration-200 hover:text-white/90"
                onClick={handleDotClick}
                title="Click me"
              >
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                {statusText}
              </div>

              <div className="hidden sm:block">Env: Production</div>
              <div>STABLE_0.4</div>
            </div>
            <p className="font-mono text-[9px] text-white/20">
              © 2026 TubeBrief Intelligence Systems. Encryption: AES-256
            </p>
          </footer>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        @keyframes glitch-r {
          0%,
          100% {
            clip-path: inset(0 0 80% 0);
          }
          25% {
            clip-path: inset(30% 0 40% 0);
          }
          50% {
            clip-path: inset(60% 0 10% 0);
          }
          75% {
            clip-path: inset(10% 0 70% 0);
          }
        }
        @keyframes glitch-l {
          0%,
          100% {
            clip-path: inset(20% 0 60% 0);
          }
          25% {
            clip-path: inset(50% 0 20% 0);
          }
          50% {
            clip-path: inset(5% 0 85% 0);
          }
          75% {
            clip-path: inset(70% 0 5% 0);
          }
        }
      `}</style>
    </main>
  );
}
