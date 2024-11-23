import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// URL validation function
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const URLShortener = ({ setUrls }) => {
  const [url, setUrl] = useState("");
  const [autoPaste, setAutoPaste] = useState(false);
  const { isSignedIn, user } = useUser();
  const inputRef = useRef(null);

  // Effect to load URLs from localStorage
  useEffect(() => {
    const storedUrls = JSON.parse(localStorage.getItem("urls")) || [];
    setUrls(storedUrls);
  }, [setUrls]);

  // Handle pasting a URL from clipboard
  const handleAutoPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      toast.success("Pasted URL from clipboard!");
    } catch (err) {
      toast.error("Unable to read from clipboard");
    }
  };

  // Handle form submission for URL shortening
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    const validatedUrl = url.startsWith("http") ? url : `http://${url}`;
    if (!isValidUrl(validatedUrl)) {
      toast.error("Please enter a valid URL");
      return;
    }

    try {
      const headers = {};
      if (isSignedIn) {
        const token = await user.getToken();
        headers.Authorization = `Bearer ${token}`;
      }

      const localUrls = JSON.parse(localStorage.getItem("urls")) || [];

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/shorten`,
        {
          url: validatedUrl,
          localUrls,
        },
        { headers }
      );

      const newUrl = {
        ...response.data.data,
        url: validatedUrl,
        clicks: 0,
        createdAt: new Date().toISOString(),
      };

      setUrls((prev) => {
        const updatedUrls = [newUrl, ...prev];
        if (!isSignedIn && updatedUrls.length > 5) {
          toast.error("Register Now to enjoy Unlimited History!");
          return prev;
        }
        localStorage.setItem("urls", JSON.stringify(updatedUrls));
        return updatedUrls;
      });

      setUrl(""); // Reset URL input
      toast.success("URL has been shortened!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to shorten URL";
      toast.error(errorMessage);
      if (errorMessage === "Unauthorized" && !isSignedIn) {
        toast.error("Please login to continue");
      }
    }
  };

  // Function to handle redirection logic
  // Updated redirection method
  const handleRedirect = async (slug) => {
    const localUrls = JSON.parse(localStorage.getItem("urls") || "[]");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/${slug}`, {
        headers: {
          "Content-Type": "application/json",
          "X-Local-Urls": JSON.stringify(localUrls),
        },
        redirect: "follow",
      });

      if (response.ok) {
        window.location.href = response.url;
      } else {
        toast.error("Short URL not found");
      }
    } catch (error) {
      console.error("Error in redirection:", error);
      toast.error("Failed to redirect");
    }
  };
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="max-w-2xl mx-auto mb-12"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter the link here"
            className="flex-1 bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-blue-600 px-6 py-2 rounded-lg font-medium"
          >
            Shorten Now
          </motion.button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="autoPaste"
            checked={autoPaste}
            onChange={(e) => {
              setAutoPaste(e.target.checked);
              if (e.target.checked) handleAutoPaste();
            }}
            className="rounded bg-gray-800"
          />
          <label htmlFor="autoPaste" className="text-gray-400">
            Auto Paste from Clipboard
          </label>
        </div>
        {!isSignedIn && (
          <p className="text-sm text-gray-400">
            You can create{" "}
            <span className="text-blue-500">
              {5 - (JSON.parse(localStorage.getItem("urls"))?.length || 0)}
            </span>{" "}
            more links.{" "}
            <button
              onClick={() => (window.location.href = "/sign-up")}
              className="text-blue-500 hover:underline"
            >
              Register Now
            </button>{" "}
            to enjoy Unlimited History!
          </p>
        )}
      </form>
    </motion.div>
  );
};

export default URLShortener;
