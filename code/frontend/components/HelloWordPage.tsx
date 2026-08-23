"use client";

import { useEffect, useState } from "react";

import styles from "./HelloWordPage.module.css";
import { getGreeting } from "../lib/mock/render-centered-hello-word";

type ViewState =
  | { status: "loading" }
  | { status: "loaded"; text: string }
  | { status: "empty" }
  | { status: "error" };

export default function HelloWordPage() {
  const [state, setState] = useState<ViewState>({ status: "loading" });

  useEffect(() => {
    let active = true;

    getGreeting()
      .then((response) => {
        if (!active) return;

        const text = response.text.trim();
        setState(text ? { status: "loaded", text } : { status: "empty" });
      })
      .catch(() => {
        if (active) setState({ status: "error" });
      });

    return () => {
      active = false;
    };
  }, []);

  if (state.status === "loading") {
    return <main className={styles.page} aria-busy="true" />;
  }

  if (state.status === "error") {
    return (
      <main className={styles.page} role="alert">
        <p className={styles.message}>Error</p>
      </main>
    );
  }

  if (state.status === "empty") {
    return (
      <main className={styles.page} role="alert">
        <p className={styles.message}>Error</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>{state.text}</h1>
    </main>
  );
}
