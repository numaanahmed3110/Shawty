"use client";
import { useState } from "react";
import URLInput from "@/components/Home/URLInput";
import Navbar from "@/components/Navbar/Navbar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import URLList from "@/components/Home/URLList";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState(null);

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
          <URLInput />
          {error && (
            <div className="text-red-500 text-center mt-4">Error : {error}</div>
          )}
          <div className="flex items-center justify-center space-x-2 mt-6 mb-3 ">
            <Switch id="clipboard" />
            <Label
              htmlFor="clipboard"
              className="text-muted-foreground text-sm"
            >
              Auto Paste from Clipboard
            </Label>
          </div>
          <div className="flex justify-center mb-6 mt-4">
            <p className="text-sm text-muted-foreground ">
              You can create <span className="text-[#EB568E] ">05</span> more
              links. Register now to enjoy Unlimited usage.{" "}
            </p>

            <Image
              src="/question.svg"
              className="ml-1.5 flex-shrink-0"
              alt=""
              height={15}
              width={15}
            />
          </div>
        </div>
        <URLList />
      </main>
    </div>
  );
}
