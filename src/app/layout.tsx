/** 루트 레이아웃 — 폰트·메타데이터·전역 Provider를 설정하는 앱 최상위 레이아웃 */

import type { Metadata } from "next";
import { Google_Sans, IBM_Plex_Mono, Noto_Sans_KR } from "next/font/google";
import Providers from "@/components/Providers";

import "./globals.css";

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

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
  title: "OEPL — Organic Electronic Physics Laboratory",
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
      lang="en"
      className={`${googleSans.variable} ${notoSansKR.variable} ${ibmPlexMono.variable}`}
    >
      <body className="min-h-screen antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
