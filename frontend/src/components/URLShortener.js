import React, { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const URLShortener = ({ onShorten }) => {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ url, slug }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to shorten URL");
      }

      const data = await response.json();
      onShorten(data);
      setUrl("");
      setSlug("");
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Failed to shorten URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex rounded-lg bg-gray-800">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter the link here"
            className="flex-grow p-4 bg-transparent text-white focus:outline-none"
            required
          />
        </div>
        <div className="flex rounded-lg bg-gray-800">
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Custom short URL (optional)"
            pattern="[a-zA-Z0-9-]*"
            title="Only letters, numbers, and hyphens are allowed"
            className="flex-grow p-4 bg-transparent text-white focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
          {loading ? "Shortening..." : "Shorten Now!"}
        </button>
      </form>
    </div>
  );
};

export default URLShortener;
