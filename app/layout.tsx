import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SportsCrush",
  description: "Add a product once — publish everywhere",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
