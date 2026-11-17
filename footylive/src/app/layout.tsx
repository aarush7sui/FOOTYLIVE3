import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FOOTYLive | Live Football Streaming, Worldwide Tournaments & Scores",
  description:
    "Experience top-tier football streaming on FOOTYLive with live multi-angle cameras, real-time match centers, 4K HDR streams, tournament brackets, and coverage of all major competitions globally.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full bg-[#0d0e12] text-[#f3f4f6]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.cdnfonts.com/css/minecraft-4" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#0d0e12] text-[#f3f4f6] antialiased selection:bg-[#00ff88] selection:text-black">
        {children}
      </body>
    </html>
  );
}
