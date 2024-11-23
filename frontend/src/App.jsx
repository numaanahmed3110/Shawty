import React, { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import URLShortener from "./components/URLShortener.jsx";
import URLList from "./components/URLList.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";

function App({ clerkFrontendApi }) {
  const [urls, setUrls] = useState([]);
  const [userUrls, setUserUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/urls");
      if (!response.ok) throw new Error("Failed to fetch URLs");
      const data = await response.json();
      setUrls(data);
    } catch (err) {
      console.error("Error fetching URLs:", err.message);
      setError("Failed to load URLs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserUrls = async () => {
      try {
        setLoading(true);
        const { userId } = await getUser();
        const response = await fetch(
          `http://localhost:3001/api/urls?userId=${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch user URLs");
        const data = await response.json();
        setUserUrls(data);
      } catch (err) {
        console.error("Error fetching user URLs:", err.message);
        setError("Failed to load user URLs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserUrls();
  }, []);

  const handleShorten = async (newUrl) => {
    try {
      const { user } = await getUser();
      const response = await fetch("http://localhost:3001/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newUrl.url, userId: user.id }),
      });
      if (!response.ok) throw new Error("Failed to shorten URL");
      const data = await response.json();
      if (user) {
        setUserUrls((prevUrls) => [data.data, ...prevUrls]);
      } else {
        setUrls((prevUrls) => [data.data, ...prevUrls]);
      }
    } catch (err) {
      console.error("Error shortening URL:", err.message);
      setError("Failed to shorten the URL. Please try again later.");
    }
  };

  const getUser = async () => {
    const { user } = await import("@clerk/clerk-react");
    return { userId: user.id };
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  // useEffect(() => {
  //   const { userId } = await getUser();
  //   if (userId) {
  //     fetchUserUrls();
  //   }
  // }, []);

  return (
    <ClerkProvider frontendApi={clerkFrontendApi}>
      <BrowserRouter>
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

            <Routes>
              <Route
                path="/"
                element={<URLShortener onShorten={handleShorten} />}
              />
              <Route
                path="/urls"
                element={
                  <SignedIn>
                    <URLList urls={userUrls} />
                  </SignedIn>
                }
              />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>

            {error && (
              <div className="text-red-500 text-center mt-4">
                Error: {error}
              </div>
            )}

            {loading ? (
              <div className="text-center mt-8">Loading...</div>
            ) : (
              <URLList urls={urls} />
            )}
          </main>
        </div>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
