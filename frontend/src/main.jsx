import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";

// Conditionally use the Clerk frontend API key based on the environment
let clerkFrontendApi;

if (import.meta.env.MODE === "development") {
  // Use the development key in development mode
  clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
} else {
  // Use the production key in production mode
  clerkFrontendApi = import.meta.env.VITE_CLERK_PRODUCTION_KEY;
}

if (!clerkFrontendApi) {
  throw new Error("Add your Clerk publishable key to the .env.local file");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkFrontendApi} afterSignOutUrl="/">
      <App />
    </ClerkProvider>{" "}
  </StrictMode>
);
