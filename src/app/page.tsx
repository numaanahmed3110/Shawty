"use client";
import { useEffect, useState } from "react";
import URLInput from "@/components/Home/URLInput";
import Navbar from "@/components/Navbar/Navbar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import URLList from "@/components/Home/URLList";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [autoClipboard, setAutoClipboard] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  const handleUrlCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleClipboardToggle = async (checked: boolean) => {
    setAutoClipboard(checked);
  };

  useEffect(() => {
    if (isLoaded) {
      setRefreshTrigger((prev) => prev + 1);
    }
  }, [isSignedIn, isLoaded]);

  // useEffect(() => {
  //   const fetchRemainingUrls = async () => {
  //     if (!isSignedIn && isLoaded) {
  //       try {
  //         const sessionId = getSessionId();
  //         const res = await axios.get(
  //           `/api/urls?sessionId=${encodeURIComponent(sessionId)}`
  //         );
  //         setRemainingUrls(Math.max(0, 4 - res.data.length));
  //       } catch (error) {
  //         console.error("Error fetching Url Count : ", error);
  //       }
  //     }
  //   };
  //   fetchRemainingUrls();
  // }, [isSignedIn, isLoaded, refreshTrigger]);

  return (
    <div>
      <Navbar />
      <main className="container overflow-x-hidden mx-auto p-4 pb-8 ">
        <div className=" text-center mx-auto max-w-4xl mt-17 mb-0">
          <h1 className="p-3 bg-gradient-to-r from-[#4A6CF3] via-[#E842A1] to-[#3B82F6] bg-clip-text text-transparent text-5xl font-bold text-center">
            Making looong links little..
          </h1>
          <p className="pt-5 text-sm text-muted-foreground">
            This is an efficient and easy-to-use URL shortning service that
            streamlines your <br />
            online experience.
          </p>
          <URLInput
            onUrlCreated={handleUrlCreated}
            autoClipboard={autoClipboard}
          />
          {error && (
            <div className="text-red-500 text-center mt-4">Error : {error}</div>
          )}
          <div className="flex items-center justify-center space-x-2 mt-6 mb-3 ">
            <Switch
              id="clipboard"
              checked={autoClipboard}
              onCheckedChange={handleClipboardToggle}
            />
            <Label
              htmlFor="clipboard"
              className="text-muted-foreground text-sm"
            >
              Auto Paste from Clipboard
            </Label>
          </div>
          {/* <div className="flex justify-center mb-6 mt-4">
            <p className="text-sm text-muted-foreground ">
              You can create{" "}
              <span className="text-[#EB568E] ">
                {remainingUrls.toString().padStart(2, "0")}
              </span>{" "}
              more links. Register now to enjoy Unlimited usage.{" "}
            </p>

            <Image
              src="/question.svg"
              className="ml-1.5 flex-shrink-0"
              alt=""
              height={15}
              width={15}
            />
          </div> */}
        </div>
        <URLList refreshTrigger={refreshTrigger} />
      </main>
    </div>
  );
}
