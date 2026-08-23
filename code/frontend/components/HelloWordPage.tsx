"use client";

import { useEffect, useState } from "react";

import styles from "./HelloWordPage.module.css";
import { getGreeting } from "../lib/mock/render-centered-hello-word";

type ViewState =
  | { status: "loading" }
  | { status: "loaded"; text: string }
  | { status: "error" };

export default function HelloWordPage() {
  const [state, setState] = useState<ViewState>({ status: "loading" });

  useEffect(() => {
    let active = true;

    getGreeting()
      .then((response) => {
        if (!active) return;

        const text = response.text.trim();
        setState(text ? { status: "loaded", text } : { status: "error" });
      })
      .catch(() => {
        if (active) setState({ status: "error" });
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className={styles.page} aria-busy={state.status === "loading"} role={state.status === "error" ? "alert" : undefined}>
      {state.status === "loaded" ? (
        <h1 className={styles.heading}>{state.text}</h1>
      ) : state.status === "error" ? (
        <p className={styles.message}>Error</p>
      ) : null}
    </main>
  );
}
