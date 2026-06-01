# 🧾 Receipt to Spreadsheet

> Upload a receipt photo → AI extracts all data → Download a clean CSV in seconds.

**Receipt to Spreadsheet** is a full-stack web application that uses Groq Vision to extract structured data from receipt images. Upload a JPG or PNG of any receipt and receive a formatted table with vendor, date, line items, quantities, prices, and totals — ready to export as CSV.

---

## ✨ Features

- 📸 **Image upload** — drag-and-drop or click to browse (JPG, PNG up to 10MB)
- 👁️ **AI extraction** — Groq Vision reads every line item with high accuracy
- 📊 **Clean table** — vendor, date, currency, items with quantity and unit price, total
- ⬇️ **CSV export** — one click downloads `receipt-YYYY-MM-DD.csv`
- 🔄 **Loading states** — spinner with friendly "Reading your receipt..." message
- ✅ **Success notification** — confirmation after successful extraction
- ❌ **Error handling** — clear messages for invalid files, API errors, unreadable images
- 📱 **Mobile-friendly** — responsive layout works on phones and tablets

### 1. Clone the repository

git clone https://github.com/EdmondKodra/receipt-to-spreadsheet.git
cd receipt-to-spreadsheet

### 2. Install all dependencies

npm run install:all

This installs dependencies for the root, backend, and frontend simultaneously.

### 3. Configure environment variables

Create a `.env` file inside the `backend` directory and add your API key.

You can use `.env.example` as a template:

### 4. Run the application

npm run dev

This starts both servers concurrently:
- **Frontend** → http://localhost:5173
- **Backend API** → http://localhost:3001

## 🔮 Future Improvements

-  PDF receipt support
-  Batch upload (multiple receipts at once)
-  Expense category tagging (Food, Travel, Office, etc.)
-  Receipt history stored in localStorage or a database
-  Multi-language receipt support
-  Dark/light mode toggle
-  Confidence scores per extracted field

---

## 💬 Exact AI Prompt Used

The following system prompt is sent to Cloude Vision for each extraction:

```
You are a receipt data extraction assistant.
Extract all information from receipt images and return ONLY valid JSON with no markdown, no code blocks, no explanation.

Return exactly this structure:
{
  "vendor": "store or restaurant name",
  "date": "YYYY-MM-DD format if possible, otherwise as printed",
  "currency": "currency symbol or code (e.g. USD, EUR, $, £)",
  "items": [
    {
      "name": "item description",
      "quantity": "quantity as string, empty string if not shown",
      "price": "item price as string without currency symbol"
    }
  ],
  "total": "total amount as string without currency symbol"
}

Rules:
- Include ALL line items visible on the receipt
- If a field is not visible, use an empty string
- Do not include tax, tips, or subtotals as line items — only actual purchased items
- Normalize prices to decimal format (e.g. "12.50" not "12,50")
- Return ONLY the JSON object, nothing else

