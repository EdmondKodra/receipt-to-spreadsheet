const express = require("express");
const multer = require("multer");
const Groq = require("groq-sdk");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, and PNG files are allowed."));
    }
  },
});

const PROMPT = `You are a receipt data extraction assistant.

Determine first whether the image is a receipt.

If the image is NOT a receipt, return ONLY this JSON:
{
  "error": "NOT_A_RECEIPT"
}

If the image is a receipt, extract all information and return ONLY valid JSON with no markdown, no code blocks, no explanation.

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
- Do not include tax, tips, or subtotals as line items
- Normalize prices to decimal format (e.g. "12.50" not "12,50")
- Return ONLY the JSON object, nothing else`;

function runMulter(req, res) {
  return new Promise((resolve, reject) => {
    upload.single("receipt")(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

router.post("/extract", async (req, res) => {
  try {
    await runMulter(req, res);
  } catch (multerErr) {
    return res.status(400).json({ error: multerErr.message || "File upload failed." });
  }

  if (!req.file) {
    return res.status(400).json({ error: "Please upload a receipt image." });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "GROQ_API_KEY is missing. Add it to backend/.env and restart the server.",
    });
  }

  try {
    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    const groq = new Groq({ apiKey });

    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
            {
              type: "text",
              text: PROMPT,
            },
          ],
        },
      ],
    });

    const rawContent = response.choices[0]?.message?.content?.trim();

    if (!rawContent) {
      return res.status(422).json({
        error: "We couldn't read this receipt. Please try another image.",
      });
    }

    // Strip markdown code fences if model adds them
    const cleaned = rawContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed;
try {
  parsed = JSON.parse(cleaned);
} catch {
  console.error("JSON parse failed. Raw output:", rawContent);
  return res.status(422).json({
    error: "We couldn't read this receipt. Please try another image.",
  });
}

// Not a receipt
if (parsed.error === "NOT_A_RECEIPT") {
  return res.status(422).json({
    error: "The uploaded image is not a receipt.",
  });
}

if (!Array.isArray(parsed.items)) {
  parsed.items = [];
}

// Empty extraction = probably not a receipt
const hasMeaningfulData =
  parsed.vendor ||
  parsed.date ||
  parsed.currency ||
  parsed.total ||
  parsed.items.length > 0;

if (!hasMeaningfulData) {
  return res.status(422).json({
    error: "The uploaded image does not appear to be a receipt.",
  });
}

return res.json({
  success: true,
  data: parsed,
});
  } catch (err) {
    console.error("Groq API error:", err?.status, err?.message || err);

    if (err?.status === 401) {
      return res.status(500).json({ error: "Invalid Groq API key. Check your key at console.groq.com" });
    }
    if (err?.status === 429) {
      return res.status(429).json({ error: "Rate limit reached. Please wait a moment and try again." });
    }

    return res.status(500).json({
      error: "Something went wrong while contacting the AI service. Please try again.",
    });
  }
});

module.exports = router;
