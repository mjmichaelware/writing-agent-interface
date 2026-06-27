"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("michaelware360@gmail.com");
  const [step, setStep] = useState<"email" | "sent">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If already logged in, redirect
    const sb = createClient();
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session) window.location.href = "/";
    });
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const sb = createClient();
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setStep("sent");
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Georgia, 'EB Garamond', serif",
      padding: "2rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Atmospheric glow */}
      <div style={{
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px",
        height: "300px",
        background: "radial-gradient(ellipse, rgba(201,169,110,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Decorative top rule */}
      <div style={{
        position: "absolute",
        top: "2.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        opacity: 0.3,
      }}>
        <div style={{ width: "60px", height: "1px", background: "#c9a96e" }} />
        <span style={{ color: "#c9a96e", fontSize: "0.6rem", letterSpacing: "0.4em" }}>✦</span>
        <div style={{ width: "60px", height: "1px", background: "#c9a96e" }} />
      </div>

      {/* Main card */}
      <div style={{
        width: "100%",
        maxWidth: "420px",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 800ms ease, transform 800ms ease",
      }}>
        {/* Title block */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{
            fontSize: "0.875rem",
            fontStyle: "italic",
            color: "#8a857c",
            marginBottom: "1rem",
          }}>Author access</p>
          <h1 style={{
            fontSize: "2.2rem",
            fontWeight: 400,
            color: "#e8e4dc",
            lineHeight: 1.2,
            margin: 0,
            fontStyle: "italic",
          }}>The Weight of<br />the Sky</h1>
          <div style={{
            width: "48px",
            height: "1px",
            background: "linear-gradient(to right, transparent, #c9a96e, transparent)",
            margin: "1.5rem auto 0",
          }} />
        </div>

        {step === "email" ? (
          <form onSubmit={handleSend}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{
                display: "block",
                fontSize: "0.875rem",
                fontStyle: "italic",
                color: "#8a857c",
                marginBottom: "0.6rem",
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(201,169,110,0.25)",
                  borderRadius: "2px",
                  padding: "0.85rem 1rem",
                  color: "#e8e4dc",
                  fontSize: "0.9375rem",
                  fontFamily: "Georgia, serif",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 300ms",
                }}
                onFocus={e => (e.target.style.borderColor = "rgba(201,169,110,0.6)")}
                onBlur={e => (e.target.style.borderColor = "rgba(201,169,110,0.25)")}
              />
            </div>

            {error && (
              <p style={{
                color: "#c0392b",
                fontSize: "0.8125rem",
                marginBottom: "1rem",
                fontStyle: "italic",
              }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.875rem",
                background: loading ? "rgba(201,169,110,0.1)" : "rgba(201,169,110,0.12)",
                border: "1px solid rgba(201,169,110,0.4)",
                borderRadius: "2px",
                color: "#c9a96e",
                fontSize: "0.9375rem",
                fontStyle: "italic",
                fontFamily: "Georgia, 'EB Garamond', serif",
                cursor: loading ? "default" : "pointer",
                transition: "all 300ms",
              }}
              onMouseOver={e => {
                if (!loading) (e.currentTarget.style.background = "rgba(201,169,110,0.2)");
              }}
              onMouseOut={e => {
                (e.currentTarget.style.background = "rgba(201,169,110,0.12)");
              }}
            >
              {loading ? "Sending…" : "Send passage →"}
            </button>

            <p style={{
              textAlign: "center",
              fontSize: "0.875rem",
              color: "#8a857c",
              marginTop: "1.5rem",
              fontStyle: "italic",
              lineHeight: 1.7,
            }}>
              A link will be sent to your email.<br />
              Click it to enter the manuscript.
            </p>
          </form>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "2.5rem",
              marginBottom: "1.5rem",
              color: "#c9a96e",
              opacity: 0.7,
            }}>✉</div>
            <h2 style={{
              fontSize: "1.1rem",
              fontWeight: 400,
              color: "#e8e4dc",
              marginBottom: "1rem",
              fontStyle: "italic",
            }}>Passage Sent</h2>
            <p style={{
              color: "#8a857c",
              fontSize: "0.875rem",
              lineHeight: 1.7,
              marginBottom: "2rem",
            }}>
              A link has been dispatched to<br />
              <span style={{ color: "#c9a96e" }}>{email}</span>.<br />
              Click it to enter the manuscript.
            </p>
            <button
              onClick={() => setStep("email")}
              style={{
                background: "transparent",
                border: "none",
                color: "#8a857c",
                fontSize: "0.8rem",
                cursor: "pointer",
                textDecoration: "underline",
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
              }}
            >
              ← Send again
            </button>
          </div>
        )}
      </div>

      {/* Bottom rule */}
      <div style={{
        position: "absolute",
        bottom: "2.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        opacity: 0.2,
      }}>
        <div style={{ width: "40px", height: "1px", background: "#c9a96e" }} />
        <span style={{ color: "#c9a96e", fontSize: "0.55rem", letterSpacing: "0.3em" }}>✦</span>
        <div style={{ width: "40px", height: "1px", background: "#c9a96e" }} />
      </div>
    </div>
  );
}
