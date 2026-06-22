import type { Metadata } from "next";
import { Noto_Sans_KR, IBM_Plex_Mono } from "next/font/google";
import { LangProvider } from "@/contexts/LangContext";

/* Pretendard — Latin/English primary font (via @fontsource, loaded as CSS) */
import "@fontsource/pretendard/latin-400.css";
import "@fontsource/pretendard/latin-500.css";
import "@fontsource/pretendard/latin-600.css";
import "@fontsource/pretendard/latin-700.css";

import "./globals.css";

/* Noto Sans KR — Korean primary font */
const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/* IBM Plex Mono — code blocks */
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OEPL — Organic Electronics & Photovoltaics Lab",
  description:
    "OEPL advances organic electronics and photovoltaic technologies for a sustainable tomorrow.",
  keywords: [
    "organic solar cell",
    "OPV",
    "photovoltaics",
    "organic electronics",
    "OEPL",
    "Ulsan University",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSansKR.variable} ${ibmPlexMono.variable}`}
    >
      <body className="min-h-screen antialiased">
          <LangProvider>{children}</LangProvider>
        </body>
    </html>
  );
}
