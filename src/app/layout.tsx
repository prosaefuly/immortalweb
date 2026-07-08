import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { AuthModal } from "@/components/AuthModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EvoluMedia | Portal Musik & Pop-Culture Modern",
  description: "EvoluMedia adalah portal media independen yang mengonsolidasikan program YouTube, rilis lagu, galeri seni digital, berita musik urban, dan komunitas member.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AppProvider>
          <Navbar />
          <main className="flex-grow pb-24">{children}</main>
          <Footer />
          <AudioPlayer />
          <AuthModal />
        </AppProvider>
      </body>
    </html>
  );
}
