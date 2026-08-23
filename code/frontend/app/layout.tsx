import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "hello-word-6",
  description: "Minimal end-to-end greeting page"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
