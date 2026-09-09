"use client";

/** 언어(KR/EN) Context — localStorage에 선택 유지 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { translations } from "@/i18n/translations";
import type { Lang } from "@/i18n/translations";

const LANG_STORAGE_KEY = "oepl-lang";
const DEFAULT_LANG: Lang = "EN";

function readStoredLang(): Lang {
  if (typeof window === "undefined") return DEFAULT_LANG;
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  return stored === "KR" || stored === "EN" ? stored : DEFAULT_LANG;
}

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof translations.KR;
}

const LangContext = createContext<LangContextValue>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: translations.EN,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    setLangState(readStoredLang());
  }, []);

  // 본문 언어를 <html lang>에 반영 — 스크린리더 발음·브라우저 번역 판단용.
  // 기본값(영문)은 DEFAULT_LANG이 담당하므로 여기서는 전환만 따라간다.
  useEffect(() => {
    document.documentElement.lang = lang === "KR" ? "ko" : "en";
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // ignore quota / private mode errors
    }
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
