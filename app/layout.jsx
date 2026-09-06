import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://youthspace.vercel.app"),

  title: {
    default: "Youth Space — Discover Zambian Talent",
    template: "%s | Youth Space",
  },

  description:
    "Discover talented young people across Zambia and explore their skills, services, and creative work.",

  applicationName: "Youth Space",

  keywords: [
    "Youth Space",
    "Zambia talent",
    "Zambian talent",
    "Zambian youth",
    "youth talent Zambia",
    "Zambia creatives",
    "Zambia skills",
  ],

  authors: [
    {
      name: "Youth Space",
    },
  ],

  creator: "Youth Space",
  publisher: "Youth Space",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Youth Space — Discover Zambian Talent",
    description:
      "Discover talented young people across Zambia and explore their skills, services, and creative work.",
    siteName: "Youth Space",
    locale: "en_ZM",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Youth Space — Discover Zambian Talent",
    description:
      "Discover talented young people across Zambia and explore their skills, services, and creative work.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col"><Providers>{children}</Providers></body>
    </html>
  );
}
