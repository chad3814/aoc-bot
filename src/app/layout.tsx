import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const hasklugNerdMono = localFont({
  src: "./fonts/HasklugNerdFontMono-Regular.otf",
  variable: "--font-hasklug-nerd-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Advent of Code Slackbot",
  description: "Shows a private leaderboard and says when someone receives a star",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${hasklugNerdMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
