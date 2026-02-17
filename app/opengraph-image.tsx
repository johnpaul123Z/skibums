import { ImageResponse } from "next/og";

export const alt = "SkiJobs – Find ski resort jobs at Vail, Alterra, Boyne & Powdr Resorts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
            width: 80,
            height: 80,
            borderRadius: 16,
            background: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)",
          }}
        >
          <span style={{ display: "flex", fontSize: 48 }}>🎿</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          Ski<span style={{ background: "linear-gradient(90deg, #22d3ee, #3b82f6)", backgroundClip: "text", color: "transparent" }}>Jobs</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#94a3b8",
            maxWidth: 700,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Find ski resort jobs at 47+ mountains · Vail, Alterra, Boyne & Powdr Resorts
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 20,
            color: "#64748b",
          }}
        >
          skijobs.net
        </div>
      </div>
    ),
    { ...size }
  );
}
