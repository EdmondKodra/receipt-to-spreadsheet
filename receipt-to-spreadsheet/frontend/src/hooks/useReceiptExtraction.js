import { useState } from "react";

export function useReceiptExtraction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const extract = async (file) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const formData = new FormData();
      formData.append("receipt", file);

      let response;
      try {
        response = await fetch("/api/receipt/extract", {
          method: "POST",
          body: formData,
        });
      } catch (networkErr) {
        throw new Error(
          "Cannot reach the server. Make sure the backend is running on port 3001."
        );
      }

      // Safely parse JSON — guard against empty or HTML error bodies
      let result;
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response from server:", text);
        throw new Error(
          `Server returned an unexpected response (HTTP ${response.status}). Check that the backend is running correctly.`
        );
      }

      if (!response.ok) {
        throw new Error(result?.error || "Extraction failed. Please try again.");
      }

      setData(result.data);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { extract, loading, error, data, reset };
}
