import React, { useState } from "react";

const URLShortener = ({ onShorten }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("URL to shorten:", url);

      const response = await fetch(
        "https://shawty-server.vercel.app/api/shorten",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText || "Failed to fetch");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL");
      }

      // Call onShorten with the data
      onShorten(data);
      setUrl("");

      // Start countdown
      setCountdown(5);
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            window.location.reload();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      // You might want to add error handling UI here
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
          className="w-full px-8 py-4 bg-blue-600 text-white font-semibold 
                   hover:bg-blue-700 disabled:opacity-50 rounded-lg 
                   transition duration-300 ease-in-out transform hover:scale-[1.02]"
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

      {/* Countdown Message */}
      {countdown !== null && (
        <div className="text-center text-white p-4 rounded-lg mt-4 animate-pulse">
          Your URL will be ready in {countdown} seconds...
        </div>
      )}
    </div>
  );
};

export default URLShortener;
