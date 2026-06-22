"use client";
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { translations } from "@/i18n/translations";
import type { Lang } from "@/i18n/translations";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof translations.KR;
}

const LangContext = createContext<LangContextValue>({
  lang: "KR",
  setLang: () => {},
  t: translations.KR,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("KR");
  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
