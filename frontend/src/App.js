// App.js
import React, { useState, useEffect } from "react";
import Header from "./components/Header.js";
import URLShortener from "./components/URLShortener.js";
import URLList from "./components/URLList.js";

function App() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/urls");
      if (!response.ok) throw new Error("Failed to fetch URLs");
      const data = await response.json();
      setUrls(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShorten = (newUrl) => {
    setUrls((prevUrls) => [newUrl, ...prevUrls]); // Add new URL to the top of the list
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 pb-8">
        <div className="text-center max-w-4xl mx-auto mt-16 mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Making <span className="text-pink-500">loooong</span> links{" "}
            <span className="text-blue-500">little..</span>
          </h2>
          <p className="text-gray-400">
            This is an efficient and easy-to-use URL shortening service that
            streamlines your online experience.
          </p>
        </div>

        <URLShortener onShorten={handleShorten} />

        {error && (
          <div className="text-red-500 text-center mt-4">Error: {error}</div>
        )}

        {loading ? (
          <div className="text-center mt-8">Loading...</div>
        ) : (
          <URLList urls={urls} />
        )}
      </main>
    </div>
  );
}

export default App;
