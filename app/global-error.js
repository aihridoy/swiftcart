"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: "0 16px",
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: "#111827" }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: 8, color: "#4b5563" }}>
            An unexpected error occurred. You can try again or head back home.
          </p>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <button
            onClick={reset}
            style={{
              borderRadius: 8,
              backgroundColor: "#dc2626",
              color: "#fff",
              padding: "12px 24px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <a
            href="/"
            style={{
              borderRadius: 8,
              border: "1px solid #d1d5db",
              padding: "12px 24px",
              fontWeight: 500,
              color: "#374151",
              textDecoration: "none",
            }}
          >
            Back to home
          </a>
        </div>
      </body>
    </html>
  );
}
