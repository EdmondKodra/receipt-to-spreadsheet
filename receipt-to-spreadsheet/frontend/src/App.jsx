import React, { useState } from "react";
import UploadZone from "./components/UploadZone";
import ImagePreview from "./components/ImagePreview";
import Spinner from "./components/Spinner";
import ErrorMessage from "./components/ErrorMessage";
import ReceiptTable from "./components/ReceiptTable";
import { useReceiptExtraction } from "./hooks/useReceiptExtraction";

export default function App() {
  const [file, setFile] = useState(null);
  const { extract, loading, error, data, reset } = useReceiptExtraction();

  const handleFile = (selected) => {
    setFile(selected);
  };

  const handleClear = () => {
    setFile(null);
    reset();
  };

  const handleExtract = () => {
    if (!file) return;
    extract(file);
  };

  const handleReset = () => {
    setFile(null);
    reset();
  };

  const canExtract = file && !loading && !data;

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      padding: "0",
    }}>
      {/* Top bar */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "22px" }}>🧾</span>
          <span style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "17px",
            color: "var(--ink)",
            letterSpacing: "-0.02em",
          }}>
            Receipt<span style={{ color: "var(--accent)" }}>.</span>io
          </span>
        </div>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: "var(--ink3)",
          background: "var(--surface2)",
          padding: "4px 10px",
          borderRadius: "4px",
          border: "1px solid var(--border)",
        }}>
          AI-powered extraction
        </span>
      </header>

      {/* Main content */}
      <main style={{
        maxWidth: "860px",
        margin: "0 auto",
        padding: "40px 20px 80px",
      }}>
        {/* Hero */}
        {!data && (
          <div style={{ marginBottom: "40px", textAlign: "center" }}>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 5vw, 48px)",
              color: "var(--ink)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "14px",
            }}>
              Receipt to{" "}
              <span style={{
                color: "var(--accent)",
                position: "relative",
              }}>
                Spreadsheet
              </span>
            </h1>
            <p style={{
              fontFamily: "var(--font-mono)",
              color: "var(--ink3)",
              fontSize: "14px",
              maxWidth: "420px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}>
              Upload a photo of any receipt. Our AI extracts vendor, items, prices,
              and totals into a clean table — ready to export as CSV.
            </p>
          </div>
        )}

        {/* Upload + result layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: file && !data ? "1fr 1fr" : "1fr",
          gap: "20px",
          alignItems: "start",
          transition: "all 0.3s ease",
        }}
          className={file ? "" : ""}
        >
          {/* Left col: upload zone (hidden once results show) */}
          {!data && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {!file ? (
                <UploadZone onFile={handleFile} disabled={loading} />
              ) : (
                <ImagePreview file={file} onClear={handleClear} />
              )}

              {/* Error message */}
              <ErrorMessage message={error} onDismiss={reset} />

              {/* Extract button */}
              {canExtract && (
                <button
                  onClick={handleExtract}
                  className="animate-fade-in"
                  style={{
                    width: "100%",
                    padding: "14px 32px",
                    background: "var(--accent)",
                    color: "#0d0d0d",
                    border: "none",
                    borderRadius: "var(--radius)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "15px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={e => { e.target.style.background = "var(--accent2)"; e.target.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.target.style.background = "var(--accent)"; e.target.style.transform = "translateY(0)"; }}
                >
                  Extract Receipt Data →
                </button>
              )}

              {/* Loading spinner */}
              {loading && <Spinner message="Reading your receipt..." />}
            </div>
          )}

          {/* Right col: instructions / preview while waiting */}
          {!data && file && !loading && (
            <div
              className="animate-fade-in"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "24px",
              }}
            >
              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--ink3)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "16px",
              }}>
                What we'll extract
              </p>
              {[
                ["🏪", "Vendor name"],
                ["📅", "Receipt date"],
                ["🛒", "All line items"],
                ["🔢", "Quantities"],
                ["💰", "Prices per item"],
                ["💳", "Total & currency"],
              ].map(([icon, label]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "9px 0",
                    borderBottom: "1px solid var(--border)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    color: "var(--ink2)",
                  }}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Empty state - before upload */}
          {!data && !file && !loading && (
            <div
              style={{
                marginTop: "32px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
              }}
            >
              {[
                { icon: "📸", title: "Take a photo", desc: "Snap your receipt and upload the image" },
                { icon: "🤖", title: "AI extracts data", desc: "GPT-4 Vision reads every line item" },
                { icon: "📊", title: "Download CSV", desc: "Export clean data for your spreadsheet" },
              ].map((step) => (
                <div
                  key={step.title}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "24px 20px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "28px", marginBottom: "12px" }}>{step.icon}</div>
                  <p style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "var(--ink)",
                    marginBottom: "6px",
                  }}>
                    {step.title}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    color: "var(--ink3)",
                    lineHeight: 1.6,
                  }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {data && (
            <ReceiptTable data={data} onReset={handleReset} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "20px 24px",
        textAlign: "center",
      }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: "var(--ink3)",
        }}>
          Powered by Groq Vision · Images are not stored · Built with React + Express
        </span>
      </footer>
    </div>
  );
}
