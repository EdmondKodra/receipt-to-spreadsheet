import React, { useRef, useState } from "react";

const ACCEPTED = ["image/jpeg", "image/jpg", "image/png"];

export default function UploadZone({ onFile, disabled }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState(null);

  const validate = (file) => {
    if (!file) return "No file selected.";
    if (!ACCEPTED.includes(file.type)) return "Only JPG, JPEG, and PNG files are accepted.";
    if (file.size > 10 * 1024 * 1024) return "File must be under 10MB.";
    return null;
  };

  const handleFile = (file) => {
    const err = validate(file);
    if (err) {
      setFileError(err);
      return;
    }
    setFileError(null);
    onFile(file);
  };

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); !disabled && setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragOver ? "var(--accent)" : "var(--border2)"}`,
          borderRadius: "var(--radius-lg)",
          padding: "48px 32px",
          textAlign: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          background: dragOver ? "rgba(232,213,163,0.04)" : "var(--surface)",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>🧾</div>
        <p style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "16px",
          color: "var(--ink)",
          marginBottom: "8px",
        }}>
          Drop your receipt here
        </p>
        <p style={{ color: "var(--ink3)", fontSize: "13px", fontFamily: "var(--font-mono)" }}>
          or click to browse — JPG, PNG up to 10MB
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={onInputChange}
          style={{ display: "none" }}
          disabled={disabled}
        />
      </div>

      {fileError && (
        <p style={{
          marginTop: "10px",
          color: "var(--red)",
          fontSize: "13px",
          fontFamily: "var(--font-mono)",
          textAlign: "center",
        }}>
          ⚠ {fileError}
        </p>
      )}
    </div>
  );
}
