import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "Security Architect Refresher",
  description: "Mobile-first security and compliance knowledge base",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1f2937" />
      </head>
      <body className="font-sans antialiased bg-gray-50">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}