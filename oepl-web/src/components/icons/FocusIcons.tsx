/** Focus 섹션 전용 커스텀 아이콘 세트 */

import { forwardRef, type ReactNode, type Ref } from "react";
import { Layers, type LucideProps } from "lucide-react";

/** Lucide default: 24×24 viewBox, stroke-only, round caps */
export const FOCUS_ICON_PROPS = {
  size: 48,
  strokeWidth: 1.5,
  color: "#E88800",
  fill: "none",
} as const;

/** Shared optical bounds — Lucide Sun/Layers span ~2–22 inside 24×24 */
const OPTICAL_INSET = 2;

type IconSvgProps = LucideProps & {
  ref?: Ref<SVGSVGElement>;
  children: ReactNode;
};

function IconSvg({ ref, color, size, strokeWidth, children, ...props }: IconSvgProps) {
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

function FocusIcon(
  props: LucideProps,
  ref: Ref<SVGSVGElement>,
  children: ReactNode
) {
  const {
    color = FOCUS_ICON_PROPS.color,
    size = FOCUS_ICON_PROPS.size,
    strokeWidth = FOCUS_ICON_PROPS.strokeWidth,
    ...rest
  } = props;

  return (
    <IconSvg ref={ref} color={color} size={size} strokeWidth={strokeWidth} {...rest}>
      {children}
    </IconSvg>
  );
}

const CX = 12;
const CY = 12;

const MATERIAL_ANGLES = [90, 30, -30, -90, -150, 150];
const MATERIAL = {
  innerR: 4.47,
  outerR: 10,
  hubDotR: 0.91,
  outerRingR: 1.11,
} as const;

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad),
  };
}

function hexPath(cx: number, cy: number, r: number) {
  return MATERIAL_ANGLES.map((deg, i) => {
    const { x, y } = polar(cx, cy, r, deg);
    return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ") + " Z";
}

/** 첨단 소재 — molecular hub, optical bounds 2–22 */
export const AdvancedMaterialsIcon = forwardRef<SVGSVGElement, LucideProps>(
  (props, ref) => {
    const spokes = MATERIAL_ANGLES.map((deg) => {
      const inner = polar(CX, CY, MATERIAL.innerR, deg);
      const outer = polar(CX, CY, MATERIAL.outerR, deg);
      const bondStart = polar(CX, CY, MATERIAL.innerR + MATERIAL.hubDotR, deg);
      const bondEnd = polar(CX, CY, MATERIAL.outerR - MATERIAL.outerRingR, deg);
      return { inner, outer, bondStart, bondEnd };
    });

    return FocusIcon(props, ref, (
      <>
        {spokes.map(({ bondStart, bondEnd }, i) => (
          <path
            key={`bond-${i}`}
            d={`M${bondStart.x.toFixed(2)} ${bondStart.y.toFixed(2)} L${bondEnd.x.toFixed(2)} ${bondEnd.y.toFixed(2)}`}
          />
        ))}
        <path d={hexPath(CX, CY, MATERIAL.innerR)} />
        {spokes.map(({ inner, outer }, i) => (
          <g key={`atom-${i}`}>
            <circle cx={inner.x} cy={inner.y} r={MATERIAL.hubDotR} />
            <circle cx={outer.x} cy={outer.y} r={MATERIAL.outerRingR} />
          </g>
        ))}
      </>
    ));
  }
);
AdvancedMaterialsIcon.displayName = "AdvancedMaterialsIcon";

const CHAR = {
  barX: OPTICAL_INSET,
  edgeX: OPTICAL_INSET + 2.5,
  endX: 24 - OPTICAL_INSET - 2.5,
  circleR: 3,
  rowY: [7.5, 16.5] as const,
  arrowGap: 1.75,
} as const;

/** 첨단 분석 — charge transport, same 2–22 optical bounds as Sun */
export const AdvancedCharacterizationIcon = forwardRef<SVGSVGElement, LucideProps>(
  (props, ref) => {
    const minusCx = CHAR.edgeX + CHAR.circleR;
    const plusCx = CHAR.endX - CHAR.circleR;
    const topArrowStart = minusCx + CHAR.circleR + CHAR.arrowGap;
    const bottomArrowEnd = plusCx - CHAR.circleR - CHAR.arrowGap;

    return FocusIcon(props, ref, (
      <>
        <path d={`M${CHAR.barX} 2v20`} />
        <path d={`M${24 - CHAR.barX} 2v20`} />

        {/* top: ⊖  → */}
        <circle cx={minusCx} cy={CHAR.rowY[0]} r={CHAR.circleR} />
        <path d={`M${minusCx - 1.1} ${CHAR.rowY[0]}h2.2`} />
        <path d={`M${topArrowStart} ${CHAR.rowY[0]}H${CHAR.endX}`} />
        <path d={`M${CHAR.endX - 1.375} ${CHAR.rowY[0] - 1.35}l1.375 1.35-1.375 1.35`} />

        {/* bottom: ←  ⊕ */}
        <path d={`M${bottomArrowEnd} ${CHAR.rowY[1]}H${CHAR.edgeX}`} />
        <path d={`M${CHAR.edgeX + 1.35} ${CHAR.rowY[1] - 1.35}l-1.35 1.35 1.35 1.35`} />
        <circle cx={plusCx} cy={CHAR.rowY[1]} r={CHAR.circleR} />
        <path d={`M${plusCx - 0.85} ${CHAR.rowY[1]}h1.7`} />
        <path d={`M${plusCx} ${CHAR.rowY[1] - 0.9}v1.8`} />
      </>
    ));
  }
);
AdvancedCharacterizationIcon.displayName = "AdvancedCharacterizationIcon";

export function DeviceEngineeringIcon(props: LucideProps) {
  return <Layers {...FOCUS_ICON_PROPS} {...props} />;
}

/** 광전기 — Lucide Sun paths, unified IconSvg */
export const PhotovoltaicsIcon = forwardRef<SVGSVGElement, LucideProps>((props, ref) =>
  FocusIcon(props, ref, (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </>
  ))
);
PhotovoltaicsIcon.displayName = "PhotovoltaicsIcon";

export const focusIcons = [
  AdvancedMaterialsIcon,
  DeviceEngineeringIcon,
  AdvancedCharacterizationIcon,
  PhotovoltaicsIcon,
] as const;
