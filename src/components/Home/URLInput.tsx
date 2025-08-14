"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";

export default function URLInput() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!value.trim()) return;
    try {
      setLoading(true);
      const res = await axios.post("/api/shorten", {
        originalUrl: value,
      });
      setShortUrl(res.data.shortUrl);
      console.log("Shortned Url : ", shortUrl);
    } catch (error) {
      console.error("Error Shortning Url : ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
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
        />
        <Button
          type="submit"
          size="sm"
          variant="primary"
          className="h-10 px-5 text-xs rounded-full 
          whitespace-nowrap cursor-pointer"
        >
          {loading ? "Shortening..." : "Shorten Now!"}
        </Button>
      </div>
    </form>
  );
}
