"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/contexts/LangContext";
import AnimatedSymbolMark from "@/components/brand/AnimatedSymbolMark";

type BrandPreviewTab = "symbol" | "logo" | "signature";

type Props = {
  tab: BrandPreviewTab;
};

const LOGO_SRC = {
  light: "/brand/oepl-logo-mark-light.png",
  dark: "/brand/oepl-logo-mark-dark.png",
} as const;

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
      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? "border-[var(--color-brand)] text-[var(--color-brand)] bg-[color-mix(in_srgb,var(--color-brand)_8%,transparent)]"
          : "border-[var(--color-neutral-200)] text-[var(--color-neutral-500)] hover:border-[var(--color-neutral-400)]"
      }`}
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

  const previewBg = hasBgToggle && darkBg ? "var(--color-neutral-900)" : "var(--color-neutral-0)";
  const previewBorder =
    hasBgToggle && darkBg ? "1px solid var(--color-neutral-800)" : "1px solid var(--color-neutral-200)";

  const imageSrc = isLogo
    ? darkBg
      ? LOGO_SRC.dark
      : LOGO_SRC.light
    : isSignature
      ? darkBg
        ? SIGNATURE_SRC.dark
        : SIGNATURE_SRC.light
      : null;

  return (
    <div className="flex flex-col items-center w-full">
      <div
        className={`w-full rounded-xl flex items-center justify-center p-6 cursor-default transition-colors ${
          isSignature ? "max-w-[320px]" : isLogo ? "max-w-[280px]" : "max-w-[220px]"
        }`}
        style={{ background: previewBg, border: previewBorder }}
        onMouseEnter={replay}
      >
        {isSymbol ? (
          <AnimatedSymbolMark playToken={playToken} className="w-32 h-32" />
        ) : imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${playToken}-${darkBg ? "dark" : "light"}`}
            src={imageSrc}
            alt={isLogo ? "OEPL Logo Mark" : "OEPL Signature"}
            className={`brand-reveal-image object-contain w-full h-auto ${
              isSignature ? "max-h-32" : "max-h-28"
            }`}
          />
        ) : null}
      </div>

      {hasBgToggle && (
        <div className="mt-3 flex gap-2">
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
