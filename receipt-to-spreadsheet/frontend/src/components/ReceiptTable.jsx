import React from "react";
import { exportToCSV } from "../utils/exportCSV";

function MetaTag({ label, value }) {
  if (!value) return null;
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    }}>
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        color: "var(--ink3)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: "14px",
        color: "var(--ink)",
      }}>
        {value}
      </span>
    </div>
  );
}

export default function ReceiptTable({ data, onReset }) {
  if (!data) return null;

  const { vendor, date, currency, items, total } = data;
  const hasItems = Array.isArray(items) && items.length > 0;

  const handleExport = () => exportToCSV(data);

  return (
    <div className="animate-slide-up" style={{ width: "100%" }}>
      {/* Success badge */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "20px",
        padding: "10px 14px",
        background: "rgba(74, 222, 128, 0.08)",
        border: "1px solid rgba(74, 222, 128, 0.25)",
        borderRadius: "var(--radius)",
      }}>
        <span style={{ fontSize: "14px" }}>✓</span>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          color: "var(--green)",
        }}>
          Receipt extracted successfully
        </span>
      </div>

      {/* Meta info row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "16px",
        padding: "20px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        marginBottom: "16px",
      }}>
        <MetaTag label="Vendor" value={vendor || "—"} />
        <MetaTag label="Date" value={date || "—"} />
        <MetaTag label="Currency" value={currency || "—"} />
        <MetaTag label="Total" value={total ? `${currency || ""} ${total}`.trim() : "—"} />
      </div>

      {/* Line items table */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        marginBottom: "20px",
      }}>
        <div style={{
          padding: "14px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--ink3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}>
            Line Items — {hasItems ? items.length : 0} found
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "var(--font-mono)",
          }}>
            <thead>
              <tr style={{ background: "var(--surface2)" }}>
                {["Item", "Qty", "Unit Price"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 20px",
                      textAlign: h === "Item" ? "left" : "right",
                      fontSize: "11px",
                      fontWeight: 500,
                      color: "var(--ink3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      borderBottom: "1px solid var(--border)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hasItems ? (
                items.map((item, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{
                      padding: "12px 20px",
                      fontSize: "13px",
                      color: "var(--ink)",
                    }}>
                      {item.name || "—"}
                    </td>
                    <td style={{
                      padding: "12px 20px",
                      fontSize: "13px",
                      color: "var(--ink2)",
                      textAlign: "right",
                    }}>
                      {item.quantity || "—"}
                    </td>
                    <td style={{
                      padding: "12px 20px",
                      fontSize: "13px",
                      color: "var(--accent)",
                      textAlign: "right",
                      fontWeight: 500,
                    }}>
                      {item.price ? `${currency || ""} ${item.price}`.trim() : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{
                    padding: "32px 20px",
                    textAlign: "center",
                    fontSize: "13px",
                    color: "var(--ink3)",
                  }}>
                    No line items detected
                  </td>
                </tr>
              )}
            </tbody>

            {/* Total footer */}
            {total && (
              <tfoot>
                <tr style={{ background: "var(--surface2)", borderTop: "2px solid var(--border2)" }}>
                  <td colSpan={2} style={{
                    padding: "12px 20px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "var(--ink2)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}>
                    Total
                  </td>
                  <td style={{
                    padding: "12px 20px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "15px",
                    color: "var(--accent)",
                    textAlign: "right",
                  }}>
                    {currency || ""} {total}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button
          onClick={handleExport}
          style={{
            flex: 1,
            minWidth: "160px",
            padding: "12px 24px",
            background: "var(--accent)",
            color: "#0d0d0d",
            border: "none",
            borderRadius: "var(--radius)",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.15s",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={e => e.target.style.background = "var(--accent2)"}
          onMouseLeave={e => e.target.style.background = "var(--accent)"}
        >
          ↓ Export CSV
        </button>

        <button
          onClick={onReset}
          style={{
            flex: 1,
            minWidth: "160px",
            padding: "12px 24px",
            background: "none",
            color: "var(--ink2)",
            border: "1px solid var(--border2)",
            borderRadius: "var(--radius)",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.target.style.borderColor = "var(--ink2)"; e.target.style.color = "var(--ink)"; }}
          onMouseLeave={e => { e.target.style.borderColor = "var(--border2)"; e.target.style.color = "var(--ink2)"; }}
        >
          ↺ Scan Another
        </button>
      </div>
    </div>
  );
}
