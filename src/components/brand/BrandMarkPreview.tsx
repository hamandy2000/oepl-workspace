"use client";

/** 브랜드 마크 미리보기 — 밝은/어두운 배경 전환 (스타일: src/styles/brand.css) */

import { useEffect, useState } from "react";
import { useLang } from "@/contexts/LangContext";
import AnimatedSymbolMark from "@/components/brand/AnimatedSymbolMark";
import AnimatedLogoMark from "@/components/brand/AnimatedLogoMark";

type BrandPreviewTab = "symbol" | "logo" | "signature";

type Props = {
  tab: BrandPreviewTab;
};

const SIGNATURE_SRC = {
  light: "/brand/oepl-signature-light.png",
  dark: "/brand/oepl-signature-dark.png",
} as const;

function BgToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? "bg-toggle-btn is-active" : "bg-toggle-btn"}
    >
      {children}
    </button>
  );
}

export default function BrandMarkPreview({ tab }: Props) {
  const { t } = useLang();
  const b = t.about.brand;
  const [playToken, setPlayToken] = useState(0);
  const [darkBg, setDarkBg] = useState(false);
  const isSymbol = tab === "symbol";
  const isLogo = tab === "logo";
  const isSignature = tab === "signature";
  const hasBgToggle = isLogo || isSignature;

  useEffect(() => {
    setPlayToken((n) => n + 1);
    setDarkBg(false);
  }, [tab]);

  useEffect(() => {
    if (hasBgToggle) setPlayToken((n) => n + 1);
  }, [darkBg, hasBgToggle]);

  const replay = () => setPlayToken((n) => n + 1);

  const boxClass = [
    "preview-box",
    isSignature ? "is-signature" : isLogo ? "is-logo" : "is-symbol",
    hasBgToggle && darkBg ? "is-dark" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const imageSrc = isSignature ? (darkBg ? SIGNATURE_SRC.dark : SIGNATURE_SRC.light) : null;

  return (
    <div className="brand-mark-preview">
      <div className={boxClass} onMouseEnter={replay}>
        {isSymbol ? (
          <AnimatedSymbolMark playToken={playToken} className="symbol-mark" />
        ) : isLogo ? (
          <AnimatedLogoMark playToken={playToken} darkMode={darkBg} className="logo-mark" />
        ) : imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${playToken}-${darkBg ? "dark" : "light"}`}
            src={imageSrc}
            alt="OEPL Signature"
            className="brand-reveal-image signature-img"
          />
        ) : null}
      </div>

      {hasBgToggle && (
        <div className="brand-bg-toggle-container">
          <BgToggleButton active={!darkBg} onClick={() => setDarkBg(false)}>
            {b.previewBgLight}
          </BgToggleButton>
          <BgToggleButton active={darkBg} onClick={() => setDarkBg(true)}>
            {b.previewBgDark}
          </BgToggleButton>
        </div>
      )}
    </div>
  );
}
