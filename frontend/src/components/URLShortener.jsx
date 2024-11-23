import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";

const URLShortener = ({ onShorten }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, userId: user?.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to shorten URL");
        return;
      }

      const { success, data } = await response.json();
      if (success) {
        onShorten(data);
        setUrl("");
      } else {
        setError("Failed to shorten URL");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="mt-8 mb-4 space-y-4">
        <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter the link here"
            className="flex-grow p-4 bg-transparent text-white focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-4 bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02]"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Shortening...
            </div>
          ) : (
            "Shorten Now!"
          )}
        </button>
      </form>

      {error && (
        <div className="text-center text-red-500 p-4 rounded-lg mt-4">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default URLShortener;
