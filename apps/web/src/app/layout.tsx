import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"]
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "Babies & Todd's Academy - Windhoek early learning",
    template: "%s | Babies & Todd's Academy"
  },
  description:
    "A bright early learning academy in Windhoek for babies, toddlers, and pre-primary children, with a connected platform for families and staff.",
  metadataBase: new URL("https://babiesandtods.com"),
  openGraph: {
    title: "Babies & Todd's Academy",
    description: "Bright early learning, joyful growth, and connected family communication.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
