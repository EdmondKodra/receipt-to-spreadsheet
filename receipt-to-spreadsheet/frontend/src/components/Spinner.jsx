import React from "react";

export default function Spinner({ message = "Processing..." }) {
  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "48px 32px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      {/* Animated receipt scanner lines */}
      <div style={{ position: "relative", width: "56px", height: "56px" }}>
        <div style={{
          width: "56px",
          height: "56px",
          border: "2px solid var(--border2)",
          borderTop: "2px solid var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.9s linear infinite",
        }} />
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "20px",
        }}>
          🧾
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <p style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "16px",
          color: "var(--ink)",
          marginBottom: "6px",
        }}>
          {message}
        </p>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          color: "var(--ink3)",
          animation: "pulse 2s ease-in-out infinite",
        }}>
          Analyzing with AI vision...
        </p>
      </div>
    </div>
  );
}
