"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallback() {
  const [status, setStatus] = useState("Opening the manuscript…");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) {
      setStatus("No passage found.");
      setTimeout(() => (window.location.href = "/login"), 2000);
      return;
    }
    const sb = createClient();
    sb.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        setStatus("Authentication failed: " + error.message);
        setTimeout(() => (window.location.href = "/login"), 2500);
      } else {
        setStatus("Welcome back. Entering the manuscript…");
        setTimeout(() => (window.location.href = "/"), 1200);
      }
    });
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Georgia, serif",
      fontStyle: "italic",
      color: "#c9a96e",
      fontSize: "1rem",
    }}>
      {status}
    </div>
  );
}
