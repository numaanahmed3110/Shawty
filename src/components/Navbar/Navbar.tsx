"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ModeToggle } from "./themeToggleButton";
import {
  SignInButton,
  useAuth,
  useUser,
  UserButton,
  SignOutButton,
} from "@clerk/nextjs";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

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
            {!isLoaded ? (
              <div className="text-sm">Loading...</div>
            ) : isSignedIn ? (
              <div className="flex items-center gap-3">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: {
                        width: "50px",
                        height: "50px",
                      },
                      avatarImage: {
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <SignInButton
                mode="modal"
                oauthFlow="popup"
                fallbackRedirectUrl="/"
              >
                <Button variant="primary">Login</Button>
              </SignInButton>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
