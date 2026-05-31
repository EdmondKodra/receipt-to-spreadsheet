# 🧾 Receipt to Spreadsheet

> Upload a receipt photo → AI extracts all data → Download a clean CSV in seconds.

**Receipt to Spreadsheet** is a full-stack web application that uses GPT-4 Vision to extract structured data from receipt images. Upload a JPG or PNG of any receipt and receive a formatted table with vendor, date, line items, quantities, prices, and totals — ready to export as CSV.

---

## ✨ Features

- 📸 **Image upload** — drag-and-drop or click to browse (JPG, PNG up to 10MB)
- 👁️ **AI extraction** — GPT-4.1 Vision reads every line item with high accuracy
- 📊 **Clean table** — vendor, date, currency, items with quantity and unit price, total
- ⬇️ **CSV export** — one click downloads `receipt-YYYY-MM-DD.csv`
- 🔄 **Loading states** — spinner with friendly "Reading your receipt..." message
- ✅ **Success notification** — confirmation after successful extraction
- ❌ **Error handling** — clear messages for invalid files, API errors, unreadable images
- 📱 **Mobile-friendly** — responsive layout works on phones and tablets
- 🔒 **Privacy-first** — images are processed in memory and never stored to disk

---

## 📸 Screenshots

| Upload Screen | Extraction Result |
|---|---|
| *(screenshot placeholder)* | *(screenshot placeholder)* |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- An [OpenAI API key](https://platform.openai.com/api-keys) with GPT-4 Vision access

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/receipt-to-spreadsheet.git
cd receipt-to-spreadsheet
```

### 2. Install all dependencies

```bash
npm run install:all
```

This installs dependencies for the root, backend, and frontend simultaneously.

### 3. Configure environment variables

```bash
cp .env.example backend/.env
```

Open `backend/.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-proj-your-key-here
PORT=3001
```

### 4. Run the application

```bash
npm run dev
```

This starts both servers concurrently:
- **Frontend** → http://localhost:5173
- **Backend API** → http://localhost:3001

Open your browser at **http://localhost:5173** and you're ready to go.

---

## 🔑 Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | ✅ Yes | — | Your OpenAI API key |
| `PORT` | No | `3001` | Port for the Express API server |

---

## 📁 Project Structure

```
receipt-to-spreadsheet/
├── backend/
│   ├── routes/
│   │   └── receipt.js      # POST /api/receipt/extract
│   ├── server.js            # Express app entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadZone.jsx      # Drag-and-drop file upload
│   │   │   ├── ImagePreview.jsx    # Preview selected receipt image
│   │   │   ├── Spinner.jsx         # Loading indicator
│   │   │   ├── ErrorMessage.jsx    # Error display component
│   │   │   └── ReceiptTable.jsx    # Extracted data table + export
│   │   ├── hooks/
│   │   │   └── useReceiptExtraction.js  # API call + state management
│   │   ├── utils/
│   │   │   └── exportCSV.js        # CSV generation + download
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json             # Root: runs both servers
├── .env.example
├── .gitignore
└── README.md
```

---

## 🌐 Deploying on Replit

1. **Import** this repo into Replit or paste the files manually.
2. In the Replit **Secrets** panel, add:
   - Key: `OPENAI_API_KEY`  Value: your OpenAI key
3. Edit `backend/.env` to use `PORT=3000` (Replit's default) or set via Secrets.
4. Update `frontend/vite.config.js` proxy target to match your backend URL if needed.
5. Run `npm run install:all` then `npm run dev` in the shell.
6. Replit will detect port 5173 (or 3000) and expose the public URL.

---

## 🤖 API Reference

### `POST /api/receipt/extract`

Accepts a multipart form upload and returns structured receipt JSON.

**Request:**
```
Content-Type: multipart/form-data
Field: receipt (file — JPG/PNG, max 10MB)
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "vendor": "Whole Foods Market",
    "date": "2024-03-15",
    "currency": "USD",
    "items": [
      { "name": "Organic Milk", "quantity": "1", "price": "4.99" },
      { "name": "Sourdough Bread", "quantity": "2", "price": "6.50" }
    ],
    "total": "18.97"
  }
}
```

**Error Response (4xx/5xx):**
```json
{
  "error": "Human-readable error message"
}
```

**Health Check:**
```
GET /health → { "status": "ok", "timestamp": "..." }
```

---

## ⚠️ Limitations

- **Image quality** — blurry, dark, or crumpled receipts may not extract accurately
- **Handwritten receipts** — partial support; printed receipts work best
- **Very long receipts** — items may be truncated if the receipt exceeds GPT-4's token limit
- **API costs** — each extraction uses OpenAI Vision API credits (approx. $0.01–0.05 per receipt depending on length)
- **File types** — only JPG and PNG are supported (not PDF, HEIC, or WEBP)
- **No persistence** — extracted data is not saved; download your CSV before closing

---

## 🔮 Future Improvements

- [ ] PDF receipt support
- [ ] Batch upload (multiple receipts at once)
- [ ] Export to Google Sheets directly
- [ ] Expense category tagging (Food, Travel, Office, etc.)
- [ ] Receipt history stored in localStorage or a database
- [ ] Multi-language receipt support
- [ ] Dark/light mode toggle
- [ ] Copy-to-clipboard for individual cells
- [ ] Confidence scores per extracted field

---

## 💬 Exact AI Prompt Used

The following system prompt is sent to GPT-4 Vision for each extraction:

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
```

---

## 📄 License

MIT — free to use, modify, and distribute.
