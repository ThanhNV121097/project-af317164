"use client";

import { useEffect, useState } from "react";

import styles from "./HelloWordPage.module.css";

type ViewState =
  | { status: "loading" }
  | { status: "loaded"; text: string }
  | { status: "error" };

export default function HelloWordPage() {
  const [state, setState] = useState<ViewState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "/api";

    fetch(`${apiBase}/v1/greeting`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("bad response");
        }

        const data = (await response.json()) as { text?: unknown };
        const text = typeof data.text === "string" ? data.text.trim() : "";
        if (!text) {
          throw new Error("missing text");
        }

        if (active) {
          setState({ status: "loaded", text });
        }
      })
      .catch(() => {
        if (active) setState({ status: "error" });
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main
      className={styles.page}
      aria-busy={state.status === "loading"}
      role={state.status === "error" ? "alert" : undefined}
    >
      {state.status === "loaded" ? (
        <h1 className={styles.heading}>{state.text}</h1>
      ) : (
        <p className={styles.message} aria-live="polite">
          {state.status === "loading" ? "Loading" : "Error"}
        </p>
      )}
    </main>
  );
}
