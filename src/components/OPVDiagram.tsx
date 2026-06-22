export default function OPVDiagram() {
  const layers = [
    { label: "Glass / Substrate",        bg: "rgba(180,210,255,0.18)", border: "rgba(180,210,255,0.45)", h: 20 },
    { label: "Transparent Electrode",     bg: "rgba(80,130,255,0.32)",  border: "rgba(100,150,255,0.65)", h: 28 },
    { label: "Electron Transport Layer",  bg: "rgba(150,70,240,0.35)",  border: "rgba(170,90,255,0.65)",  h: 26 },
    { label: "Active Layer",              bg: "rgba(232,136,0,0.55)",   border: "rgba(255,165,30,0.90)",   h: 36, glow: true },
    { label: "Hole Transport Layer",      bg: "rgba(232,136,0,0.22)",   border: "rgba(232,136,0,0.55)",   h: 24 },
    { label: "Electrode",                 bg: "rgba(50,75,130,0.55)",   border: "rgba(80,110,160,0.65)",  h: 28 },
  ];

  const dots = [
    { x: "12%", y: "40%" }, { x: "28%", y: "18%" },
    { x: "52%", y: "58%" }, { x: "70%", y: "28%" },
    { x: "85%", y: "52%" },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-end">
      {/* 3-D layer stack */}
      <div
        className="relative"
        style={{ perspective: "1100px", perspectiveOrigin: "55% 42%", width: 380, height: 330 }}
      >
        <div
          className="absolute inset-0 flex flex-col justify-center gap-[7px] px-6"
          style={{ transform: "rotateX(38deg) rotateY(-12deg)", transformStyle: "preserve-3d" }}
        >
          {layers.map((l, i) => (
            <div key={i} className="relative w-full" style={{ height: l.h }}>
              <div
                className="absolute inset-0"
                style={{
                  background: l.bg,
                  borderTop:    `1px solid ${l.border}`,
                  borderLeft:   `1px solid ${l.border}`,
                  borderRight:  `1px solid ${l.border}`,
                  boxShadow: l.glow
                    ? "0 0 20px rgba(232,136,0,0.45), inset 0 0 10px rgba(232,136,0,0.2)"
                    : "none",
                }}
              />
              {l.glow &&
                dots.map((d, pi) => (
                  <div
                    key={pi}
                    className="absolute w-[5px] h-[5px] rounded-full"
                    style={{
                      left: d.x, top: d.y,
                      background: "#E88800",
                      boxShadow: "0 0 6px 2px rgba(232,136,0,0.7)",
                    }}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Right labels */}
      <div
        className="absolute right-0 top-0 bottom-0 flex flex-col justify-center gap-[7px]"
        style={{ width: 190 }}
      >
        {layers.map((l, i) => (
          <div key={i} className="flex items-center gap-2" style={{ height: l.h }}>
            <div
              className="flex-1 border-t border-dashed opacity-40"
              style={{ borderColor: l.border }}
            />
            <span
              className="text-[10px] whitespace-nowrap"
              style={{ color: l.glow ? "#E88800" : "#7f93b8" }}
            >
              {l.label}
            </span>
          </div>
        ))}
      </div>

      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 320, height: 280, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(232,136,0,0.06) 0%, transparent 70%)",
          left: "5%", top: "50%", transform: "translateY(-50%)",
        }}
      />
    </div>
  );
}
