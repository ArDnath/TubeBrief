"use client";

import type React from "react";
import { forwardRef } from "react";
import { Shader } from "react-shaders";
import { cn } from "@/lib/utils";

export interface HologramShadersProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Animation and interference speed
   * @default 1.0
   */
  speed?: number;

  /**
   * Overall hologram brightness
   * @default 1.0
   */
  intensity?: number;

  /**
   * Power stability level
   * @default 1.0
   */
  stability?: number;

  /**
   * Scan line density and frequency
   * @default 1.0
   */
  scanlines?: number;

  /**
   * Chromatic aberration amount
   * @default 1.0
   */
  prismatic?: number;
}

const fragmentShader = `
// Hash function for noise generation
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Smooth noise function
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Holographic interference pattern
float interferencePattern(vec2 uv, float time) {
    // Multiple wave layers for complex interference
    float wave1 = sin(uv.x * 15.0 + time * 2.0) * cos(uv.y * 10.0 + time * 1.5);
    float wave2 = sin(uv.x * 8.0 - time * 1.8) * cos(uv.y * 12.0 - time * 2.2);
    float wave3 = sin(uv.x * 20.0 + uv.y * 15.0 + time * 1.0);

    // Combine waves with different amplitudes
    return (wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.3) * 0.5 + 0.5;
}

// Scan line effect
float scanLines(vec2 uv, float time, float density) {
    // Moving scan lines
    float scanLine1 = sin((uv.y + time * 0.1) * density * 40.0);
    float scanLine2 = sin((uv.y - time * 0.05) * density * 25.0);

    // Occasional intense scan bursts
    float burstLine = sin(uv.y * 5.0 + time * 3.0) * step(0.95, noise(vec2(time * 2.0, 0.0)));

    return (scanLine1 * 0.3 + scanLine2 * 0.2 + burstLine * 0.8) * 0.5 + 0.7;
}

// Hologram instability and flickering
float hologramFlicker(vec2 uv, float time, float stability) {
    // Power fluctuation based on noise
    float powerFlicker = noise(vec2(time * 5.0, 0.0));

    // Occasional complete flicker outs
    float majorFlicker = step(0.95 + stability * 0.04, noise(vec2(time * 3.0, 1.0)));

    // Local instability patches
    float localInstability = noise(uv * 3.0 + time * 2.0);
    localInstability = step(0.7 + stability * 0.2, localInstability);

    // Combine all instability factors
    float baseStability = 0.7 + stability * 0.3;
    float finalStability = baseStability * (1.0 - majorFlicker * 0.8) * (1.0 - localInstability * 0.3);

    return mix(0.3, 1.0, finalStability * (0.8 + powerFlicker * 0.2));
}

// Prismatic color separation
vec3 prismaticSeparation(vec2 uv, float time, float amount) {
    // Create slight RGB separation like real holograms
    vec2 redOffset = vec2(amount * 0.002 * sin(time), 0.0);
    vec2 greenOffset = vec2(0.0, amount * 0.002 * cos(time * 1.3));
    vec2 blueOffset = vec2(-amount * 0.002 * sin(time * 0.8), amount * 0.002 * cos(time * 1.7));

    // Sample interference pattern for each channel
    float red = interferencePattern(uv + redOffset, time);
    float green = interferencePattern(uv + greenOffset, time + 100.0);
    float blue = interferencePattern(uv + blueOffset, time + 200.0);

    return vec3(red, green, blue);
}

// Depth scanning effect
float depthScan(vec2 uv, float time) {
    // Moving depth planes
    float scan1 = sin(time * 1.5 + uv.y * 8.0);
    float scan2 = sin(time * 2.0 - uv.x * 6.0);

    // Create scanning plane effect
    float depthPlane = fract(time * 0.2);
    float planeDistance = abs(uv.y - depthPlane);
    float planeScan = exp(-planeDistance * 20.0) * 2.0;

    return (scan1 * scan2 * 0.3 + planeScan) * 0.5 + 0.5;
}

// Edge detection and holographic rim
float hologramEdge(vec2 uv) {
    // Distance from edges
    float edgeX = min(uv.x, 1.0 - uv.x);
    float edgeY = min(uv.y, 1.0 - uv.y);
    float edgeDistance = min(edgeX, edgeY);

    // Create rim lighting effect
    float rim = exp(-edgeDistance * 8.0) * 0.5;

    return rim;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord / iResolution.xy;
    float time = iTime * u_speed;

    // Base holographic interference pattern with prismatic separation
    vec3 baseColor = prismaticSeparation(uv, time, u_prismatic);

    // Apply holographic interference
    float interference = interferencePattern(uv, time);
    baseColor *= interference;

    // Add scan line effects
    float scanEffect = scanLines(uv, time, u_scanlines);
    baseColor *= scanEffect;

    // Apply depth scanning
    float depth = depthScan(uv, time);
    baseColor += vec3(0.1, 0.3, 0.5) * depth * 0.3;

    // Hologram instability and flickering
    float flicker = hologramFlicker(uv, time, u_stability);
    baseColor *= flicker;

    // Add edge glow for holographic rim
    float edge = hologramEdge(uv);
    baseColor += vec3(0.2, 0.6, 1.0) * edge;

    // Holographic color palette (cyan/blue dominant)
    vec3 hologramTint = vec3(0.3, 0.8, 1.0);
    baseColor = mix(baseColor, baseColor * hologramTint, 0.6);

    // Add subtle noise for digital artifacts
    float digitalNoise = noise(uv * 100.0 + time * 10.0);
    baseColor += (digitalNoise - 0.5) * 0.05;

    // Power level based on stability
    float powerLevel = 0.6 + u_stability * 0.4;
    baseColor *= powerLevel;

    // Apply overall intensity
    baseColor *= u_intensity;

    // Add holographic transparency effect
    float alpha = 0.7 + interference * 0.2 + flicker * 0.1;

    // Ensure we don't exceed color bounds
    baseColor = clamp(baseColor, 0.0, 1.0);

    fragColor = vec4(baseColor, alpha);
}
`;

export const HologramShaders = forwardRef<HTMLDivElement, HologramShadersProps>(
  (
    {
      className,
      speed = 1.0,
      intensity = 1.0,
      stability = 1.0,
      scanlines = 1.0,
      prismatic = 1.0,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn("w-full h-full", className)}
        ref={ref}
        {...(props as any)}
      >
        <Shader
          fs={fragmentShader}
          style={{ width: "100%", height: "100%" } as CSSStyleDeclaration}
          uniforms={{
            u_speed: { type: "1f", value: speed },
            u_intensity: { type: "1f", value: intensity },
            u_stability: { type: "1f", value: stability },
            u_scanlines: { type: "1f", value: scanlines },
            u_prismatic: { type: "1f", value: prismatic },
          }}
        />
      </div>
    );
  },
);

HologramShaders.displayName = "HologramShaders";

export default HologramShaders;
