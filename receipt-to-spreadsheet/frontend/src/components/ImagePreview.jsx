import React from "react";

export default function ImagePreview({ file, onClear }) {
  if (!file) return null;

  const url = URL.createObjectURL(file);

  return (
    <div
      className="animate-fade-in"
      style={{
        position: "relative",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        border: "1px solid var(--border2)",
        background: "var(--surface)",
      }}
    >
      <img
        src={url}
        alt="Receipt preview"
        style={{
          width: "100%",
          maxHeight: "360px",
          objectFit: "contain",
          display: "block",
          background: "#1a1a1a",
        }}
        onLoad={() => URL.revokeObjectURL(url)}
      />

      {/* File info bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 14px",
        borderTop: "1px solid var(--border)",
        background: "var(--surface2)",
      }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          color: "var(--ink2)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "200px",
        }}>
          {file.name}
        </span>
        <button
          onClick={onClear}
          style={{
            background: "none",
            border: "1px solid var(--border2)",
            borderRadius: "var(--radius-sm)",
            color: "var(--ink3)",
            cursor: "pointer",
            fontSize: "12px",
            fontFamily: "var(--font-mono)",
            padding: "3px 10px",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.target.style.borderColor = "var(--red)"; e.target.style.color = "var(--red)"; }}
          onMouseLeave={e => { e.target.style.borderColor = "var(--border2)"; e.target.style.color = "var(--ink3)"; }}
        >
          ✕ remove
        </button>
      </div>
    </div>
  );
}
