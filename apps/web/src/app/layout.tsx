import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Babies & Todd's Academy",
  description: "Early learning academy management platform"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
