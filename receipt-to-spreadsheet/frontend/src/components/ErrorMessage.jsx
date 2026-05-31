import React from "react";

export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      className="animate-fade-in"
      style={{
        background: "rgba(248, 113, 113, 0.08)",
        border: "1px solid rgba(248, 113, 113, 0.3)",
        borderRadius: "var(--radius)",
        padding: "14px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <span style={{ fontSize: "16px", marginTop: "1px" }}>⚠</span>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "13px",
          color: "var(--red)",
          lineHeight: 1.5,
        }}>
          {message}
        </p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: "none",
            border: "none",
            color: "var(--red)",
            cursor: "pointer",
            fontSize: "16px",
            opacity: 0.7,
            flexShrink: 0,
            padding: "0 4px",
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
