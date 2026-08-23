import "./globals.css";

export const metadata = {
  title: "hello-word-6",
  description: "Minimal full-stack hello-word-6 page"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
