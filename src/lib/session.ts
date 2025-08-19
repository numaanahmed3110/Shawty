"use client";

export function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem("shawty_session_id");

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    localStorage.setItem("shawty_session_id", sessionId);
  }
  return sessionId;
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("shawty_session_id");
  }
}
