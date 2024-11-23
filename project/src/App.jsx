import { useState, useEffect } from "react";
import {
  ClerkProvider,
  SignIn,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import URLShortener from "./components/URLShortener";
import URLList from "./components/URLList";
import "./App.css";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const localUrls = localStorage.getItem("urls");
    if (localUrls) {
      setUrls(JSON.parse(localUrls));
    }
    setIsLoading(false);
  }, []);

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      navigate={(to) => (window.location.href = to)}
    >
      <div className="min-h-screen bg-gray-900 text-white">
        <Toaster position="top-center" />
        <nav className="flex justify-between items-center p-4">
          <motion.h1
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-3xl font-bold text-pink-500"
          >
            SHAWTY
          </motion.h1>
          <div className="flex gap-4">
            <SignedOut>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 px-4 py-2 rounded-lg"
                onClick={() => (window.location.href = "/sign-in")}
              >
                Login
              </motion.button>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500 text-transparent bg-clip-text">
              Making looong links little..
            </h2>
            <p className="text-gray-400">
              Shawty is an efficient and easy-to-use URL shortening service
              <br /> that streamlines your online experience.
            </p>
          </motion.div>

          <URLShortener setUrls={setUrls} />
          <URLList urls={urls} setUrls={setUrls} isLoading={isLoading} />
        </main>
      </div>
    </ClerkProvider>
  );
}

export default App;
