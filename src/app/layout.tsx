import type { Metadata } from "next";
import { Lora, Geist, Geist_Mono, Courier_Prime, Orbitron } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Code2, List, PlusCircle, Settings2 } from "lucide-react";
import { ThemeProvider } from "@/components/ThemeProvider";
import MobileNav from "@/components/MobileNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const courierPrime = Courier_Prime({
  weight: "400",
  variable: "--font-retro",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  weight: "400",
  variable: "--font-sci-fi",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://code-engineer.vercel.app"),
  title: "codeEngineer",
  description: "開発者向けのコーディング問題ジェネレーター。",
  openGraph: {
    title: "codeEngineer",
    description: "開発者向けのコーディング問題ジェネレーター。",
    url: "https://code-engineer.vercel.app", // 仮のURL、適宜変更してください
    siteName: "codeEngineer",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "codeEngineer",
    description: "開発者向けのコーディング問題ジェネレーター。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${lora.variable} ${geistSans.variable} ${geistMono.variable} ${courierPrime.variable} ${orbitron.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground transition-all duration-500">
        <ThemeProvider>
          {/* Global Fixed Background Layer (Layer 2) */}
          <div className="fixed inset-0 bg-google-ai -z-20 pointer-events-none" />

          {/* Header - Fixed height, clean for all devices */}
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                <Code2 className="w-8 h-8 text-primary shrink-0" />
                <span className="tracking-tight truncate bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">CodeEngineer</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                <Link href="/problems" className="flex items-center gap-2 transition-colors hover:text-primary">
                  <List className="w-4 h-4" />
                  <span>過去問</span>
                </Link>
                <Link href="/generate" className="flex items-center gap-2 transition-colors hover:text-primary">
                  <PlusCircle className="w-4 h-4" />
                  <span>挑戦</span>
                </Link>
                <Link href="/settings" className="flex items-center gap-2 hover:text-primary transition-colors text-sm font-medium">
                  <Settings2 className="w-4 h-4" />
                  <span>設定</span>
                </Link>
              </nav>

              <div className="md:hidden invisible">
                {/* Spacer for center-aligned feeling logo or future Profile icon */}
                <Settings2 className="w-5 h-5" />
              </div>
            </div>
          </header>

          {/* Mobile bottom navigation bar (Client Component) */}
          <MobileNav />

          <main className="flex-1 container mx-auto px-4 py-6 md:py-10 mb-24 md:mb-0">
            {children}
          </main>
          <footer className="border-t py-8 bg-muted/5 opacity-80 mt-auto">
            <div className="container mx-auto px-4 text-center text-[10px] md:text-sm text-secondary">
              &copy; {new Intl.DateTimeFormat('ja-JP', { year: 'numeric', timeZone: 'Asia/Tokyo' }).format(new Date())} codeEngineer - Made for 2525aina
            </div>
          </footer>

          {/* Nav Spacer for Mobile - Ensures footer isn't hidden behind the fixed Nav Bar */}
          <div className="h-24 md:hidden" aria-hidden="true" />
        </ThemeProvider>
      </body>
    </html>
  );
}
