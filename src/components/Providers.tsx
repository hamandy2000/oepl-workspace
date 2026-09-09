"use client";

/** 전역 Provider 묶음 — 언어·콘텐츠·인증 Context */

import { AuthProvider } from "@/contexts/AuthContext";
import { ContentProvider } from "@/contexts/ContentContext";
import { LangProvider } from "@/contexts/LangContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <AuthProvider>
        <ContentProvider>{children}</ContentProvider>
      </AuthProvider>
    </LangProvider>
  );
}
