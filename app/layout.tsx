import "./globals.css";
import "./home.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Red_Hat_Mono } from "next/font/google";
import localFont from "next/font/local";

import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import siteIcon from "@/app/assets/gdgc.png";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const redHatMono = Red_Hat_Mono({
  variable: "--font-red-hat-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const googleSans = localFont({
  src: "./fonts/google-sans/GoogleSans-Latin.woff2",
  variable: "--font-google-sans",
  weight: "400 700",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GDGC NITJ · Learn. Build. Belong.",
  description:
    "Meet the GDG on Campus community at NIT Jalandhar. Explore our events, departments, student leads, and campus moments.",
  icons: {
    icon: siteIcon.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${redHatMono.variable} ${inter.variable} ${googleSans.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a href="#main-content" className="club-skip-link">
            Skip to content
          </a>
          <header className="club-site-header">
            <Navbar />
          </header>
          <main id="main-content">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
