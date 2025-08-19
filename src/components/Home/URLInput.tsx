"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { getSessionId } from "@/lib/session";
import { useAuth } from "@clerk/nextjs";

interface UrlInputProps {
  onUrlCreated?: () => void;
  autoClipboard?: boolean;
}

export default function URLInput({
  onUrlCreated,
  autoClipboard,
}: UrlInputProps) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [clipboardPasted, setClipboardPasted] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [remainingUrls, setRemainingUrls] = useState(4);
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const id = getSessionId();
    setSessionId(id);
  }, []);

  useEffect(() => {
    const readClipboard = async () => {
      if (autoClipboard) {
        try {
          const text = await navigator.clipboard.readText();
          if (
            text &&
            text.trim() &&
            text !== value &&
            (text.startsWith("http://") ||
              text.startsWith("https://") ||
              text.includes("."))
          ) {
            setValue(text.trim());
            setClipboardPasted(true);

            setTimeout(() => setClipboardPasted(false), 3000);
          }
        } catch (error) {
          console.error("Failed to read Clipboard : ", error);
        }
      }
    };

    if (autoClipboard) {
      readClipboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoClipboard]);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if guest user has reached limit
    if (!isSignedIn && remainingUrls <= 0) {
      setError(
        "You've reached the limit of 4 URLs. Register now for unlimited usage!"
      );
      return;
    }
    if (!validateUrl(value)) {
      setError("Please enter a valid URL");
      return;
    }
    if (!value.trim()) return;

    try {
      setLoading(true);
      setError(""); // Clear previous errors

      console.log("📤 Sending sessionId:", sessionId); // Add this

      const res = await axios.post("/api/shorten", {
        originalUrl: value,
        sessionId,
      });

      console.log("📥 Response data:", res.data); // Add this

      setShortUrl(res.data.shortUrl);
      console.log("Shortned Url : ", shortUrl);
      setValue("");
      setClipboardPasted(false);

      // Update remaining URLs count for guest users
      if (!isSignedIn) {
        setRemainingUrls((prev) => Math.max(0, prev - 1));
      }

      onUrlCreated?.();
    } catch (error) {
      console.error("Error Shortening URL:", error);
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        setError(
          "You've reached the limit of 4 URLs. Register now for unlimited usage!"
        );
      } else {
        setError(
          (axios.isAxiosError(error) && error.response?.data?.error) ||
            "Something went wrong"
        );
      }
      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setClipboardPasted(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <div
          className="flex items-center mt-5 mb-3 pl-3 pr-1 h-12 w-full rounded-full border border-input 
      bg-[#1b2230] text-sm "
        >
          <Image
            src="/link.svg"
            className="mr-1.5 flex-shrink-0"
            alt=""
            width={20}
            height={20}
          />
          <Input
            type="url"
            value={value}
            onChange={handleInputChange}
            placeholder="Enter your link here"
            className="flex-1 pl-0.5 h-full w-full bg-transparent outline-none 
          border-none placeholder:text-muted-foreground text-sm"
            required
            disabled={!isSignedIn && remainingUrls <= 0}
          />
          <Button
            type="submit"
            size="sm"
            variant="primary"
            className="h-10 px-5 text-xs rounded-full 
          whitespace-nowrap cursor-pointer"
            disabled={loading || (!isSignedIn && remainingUrls <= 0)}
          >
            {loading ? "Shortening..." : "Shorten Now!"}
          </Button>
        </div>
      </form>

      {/* Guest user limit warning */}
      {!isSignedIn && isLoaded && (
        <div className="mt-2 text-center">
          {remainingUrls > 0 ? (
            <p className="text-xs text-muted-foreground">
              You can create{" "}
              <span className="text-[#EB568E] font-semibold">
                {remainingUrls.toString().padStart(2, "0")}
              </span>{" "}
              more links. Register now for unlimited usage.
            </p>
          ) : (
            <div className="p-3 bg-orange-900/20 border border-orange-500 rounded-lg">
              <p className="text-orange-400 text-sm font-medium">
                🚫 Limit Reached! Register now for unlimited URL shortening.
              </p>
            </div>
          )}
        </div>
      )}
      {error && (
        <div className="mt-2 p-2 bg-red-900/20 border border-red-500 rounded-lg">
          <p className="text-red-400 text-xs">❌ {error}</p>
        </div>
      )}
      {/* ✅ Visual feedback for clipboard paste */}
      {clipboardPasted && (
        <div className="mt-2 p-2 bg-blue-900/20 border border-blue-500 rounded-lg">
          <p className="text-blue-400 text-xs">
            📋 Auto-pasted from clipboard!
          </p>
        </div>
      )}
    </div>
  );
}
