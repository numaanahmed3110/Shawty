"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ModeToggle } from "./themeToggleButton";
import { SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full border-b sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-border/50"
          : "bg-background border-border"
      }`}
    >
      <div className="container mx-auto px-10">
        <nav className="flex justify-between items-center h-16">
          <div>
            <h1 className="bg-gradient-to-r from-[#4A6CF3] via-[#E842A1] to-[#3B82F6] bg-clip-text text-transparent text-3xl font-bold text-center">
              SHAWTY
            </h1>
          </div>
          <div className="flex items-center justify-between gap-5">
            <SignInButton mode="modal">
              <Button variant="primary">Login</Button>
            </SignInButton>
            <ModeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
