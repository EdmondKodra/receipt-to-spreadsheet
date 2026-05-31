/**
 * Converts receipt data to CSV and triggers browser download.
 * Filename format: receipt-YYYY-MM-DD.csv
 */
export function exportToCSV(receiptData) {
  const { vendor, date, currency, items, total } = receiptData;

  // Build CSV rows
  const rows = [
    ["Receipt Summary"],
    ["Vendor", vendor || ""],
    ["Date", date || ""],
    ["Currency", currency || ""],
    [""],
    ["Line Items"],
    ["Item Name", "Quantity", "Unit Price"],
  ];

  items.forEach((item) => {
    rows.push([
      item.name || "",
      item.quantity || "",
      item.price || "",
    ]);
  });

  rows.push([""]);
  rows.push(["TOTAL", "", total || ""]);

  // Escape CSV cells
  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          const str = String(cell);
          // Wrap in quotes if it contains comma, quote, or newline
          if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(",")
    )
    .join("\n");

  // Determine filename using date field or today
  let fileDate = new Date().toISOString().split("T")[0];
  if (date) {
    // Attempt to parse and reformat
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      fileDate = parsed.toISOString().split("T")[0];
    }
  }

  const filename = `receipt-${fileDate}.csv`;

  // Trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
