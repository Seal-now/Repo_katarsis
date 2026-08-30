import { useEffect, useRef, useState } from "react";

interface Pt { x: number; y: number }

const N = 10; // segments (head + 9 body)
const SEG_DIST = 13; // distance between segment centres
const QUIPS = [
  "найдём твоего 🔥",
  "ЕГЭ на 90+? 💅",
  "вайб важен ✨",
  "МГУ ждёт 👀",
  "без паники 🫶",
  "учёба = кайф?",
  "пройди тест!",
  "топ преп рядом",
];

function makeChain(): Pt[] {
  const cx = typeof window !== "undefined" ? window.innerWidth / 2 : 400;
  const cy = typeof window !== "undefined" ? window.innerHeight / 2 : 300;
  return Array.from({ length: N }, (_, i) => ({ x: cx - i * SEG_DIST, y: cy }));
}

export function Mascot() {
  const chainRef = useRef<Pt[]>(makeChain());
  const targetRef = useRef<Pt>({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);
  const [chain, setChain] = useState<Pt[]>(makeChain());
  const [tick, setTick] = useState(0);
  const tickRef = useRef(0);
  const [blink, setBlink] = useState(false);
  const [quip, setQuip] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let moved = false;

    const onMove = (e: MouseEvent) => {
      if (!moved) { setVisible(true); moved = true; }
      targetRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const animate = () => {
      tickRef.current += 1;
      const c = chainRef.current;
      const t = targetRef.current;

      // Head chases cursor
      const dx = t.x - c[0].x;
      const dy = t.y - c[0].y;
      c[0] = { x: c[0].x + dx * 0.09, y: c[0].y + dy * 0.09 };

      // Each segment follows the one ahead of it
      for (let i = 1; i < N; i++) {
        const prev = c[i - 1];
        const curr = c[i];
        const dist = Math.hypot(prev.x - curr.x, prev.y - curr.y);
        if (dist > SEG_DIST) {
          const r = (dist - SEG_DIST) / dist;
          c[i] = { x: curr.x + (prev.x - curr.x) * r, y: curr.y + (prev.y - curr.y) * r };
        }
      }
      chainRef.current = c.map(p => ({ ...p }));
      setChain(c.map(p => ({ ...p })));
      setTick(tickRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    // Blink loop
    const doBlink = () => {
      const wait = 2200 + Math.random() * 2500;
      setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); doBlink(); }, 120);
      }, wait);
    };
    doBlink();

    // Quip loop
    const qi = setInterval(() => {
      setQuip(QUIPS[Math.floor(Math.random() * QUIPS.length)]);
      setTimeout(() => setQuip(null), 2400);
    }, 8000);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
      clearInterval(qi);
    };
  }, []);

  if (!visible) return null;

  const t = tick * 0.06; // walking phase

  // Head direction vector
  const head = chain[0];
  const neck = chain[1] ?? chain[0];
  const headAngle = Math.atan2(head.y - neck.y, head.x - neck.x);
  const fwd = { x: Math.cos(headAngle), y: Math.sin(headAngle) };
  const right = { x: -fwd.y, y: fwd.x }; // perpendicular right

  // Antenna tips (two antennae slightly splayed)
  const antennaL = {
    x: head.x + fwd.x * 22 - right.x * 8,
    y: head.y + fwd.y * 22 - right.y * 8,
  };
  const antennaR = {
    x: head.x + fwd.x * 22 + right.x * 8,
    y: head.y + fwd.y * 22 + right.y * 8,
  };
  // Antenna roots at sides of head
  const antennaLRoot = {
    x: head.x + fwd.x * 8 - right.x * 9,
    y: head.y + fwd.y * 8 - right.y * 9,
  };
  const antennaRRoot = {
    x: head.x + fwd.x * 8 + right.x * 9,
    y: head.y + fwd.y * 8 + right.y * 9,
  };

  // Eye positions (left and right of facing direction)
  const eyeL = { x: head.x + fwd.x * 4 - right.x * 6, y: head.y + fwd.y * 4 - right.y * 6 };
  const eyeR = { x: head.x + fwd.x * 4 + right.x * 6, y: head.y + fwd.y * 4 + right.y * 6 };

  // Mouth
  const mouthC = { x: head.x + fwd.x * 13, y: head.y + fwd.y * 13 };

  // Segment widths (taper toward tail)
  const segW = (i: number) => (i === 0 ? 15 : Math.max(6, 13 - i * 0.7));
  const segH = (i: number) => (i === 0 ? 15 : Math.max(5, 11 - i * 0.5));

  // Segment rotation angle (from previous to current)
  const segAngle = (i: number) => {
    const a = chain[i];
    const b = chain[Math.min(i + 1, N - 1)];
    return (Math.atan2(a.y - b.y, a.x - b.x) * 180) / Math.PI;
  };

  // Leg endpoint for segment i, side = +1 right / -1 left
  const legEnd = (i: number, side: 1 | -1) => {
    const seg = chain[i];
    const next = chain[Math.min(i + 1, N - 1)];
    const ang = Math.atan2(seg.y - next.y, seg.x - next.x);
    const perp = ang + (Math.PI / 2) * side;
    const wave = Math.sin(t + i * 0.9) * 5 * side;
    const len = 11;
    return {
      x: seg.x + Math.cos(perp) * len + Math.cos(perp + 0.5) * wave,
      y: seg.y + Math.sin(perp) * len + Math.sin(perp + 0.5) * wave,
    };
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 hidden md:block">
      {/* Speech bubble */}
      <div
        className="absolute font-display text-[10px] font-bold whitespace-nowrap px-2.5 py-1 rounded-xl"
        style={{
          left: head.x,
          top: head.y - 48,
          transform: "translateX(-50%)",
          background: "#FFD47A",
          color: "#0D0D0D",
          opacity: quip ? 1 : 0,
          transition: "opacity 0.2s",
          boxShadow: "0 2px 12px rgba(255,212,122,0.45)",
        }}
      >
        {quip ?? "‎"}
      </div>

      <svg
        className="absolute inset-0 w-full h-full"
        style={{ filter: "drop-shadow(0 4px 16px rgba(244,191,201,0.3))" }}
      >
        {/* Body segments — draw tail-first so head renders on top */}
        {Array.from({ length: N }, (_, i) => N - 1 - i).map(i => {
          const seg = chain[i];
          const isHead = i === 0;
          const w = segW(i);
          const h = segH(i);
          const ang = segAngle(i);
          const shade = i % 2 === 0 ? "#F4BFC9" : "#f0b8c5";

          const legL = !isHead ? legEnd(i, -1) : null;
          const legR = !isHead ? legEnd(i, 1) : null;

          return (
            <g key={i}>
              {/* Legs */}
              {legL && legR && (
                <>
                  <line x1={seg.x} y1={seg.y} x2={legL.x} y2={legL.y}
                    stroke="#F4BFC9" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1={seg.x} y1={seg.y} x2={legR.x} y2={legR.y}
                    stroke="#F4BFC9" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Tiny foot pads */}
                  <circle cx={legL.x} cy={legL.y} r="2.2" fill="#FFD47A" opacity="0.8" />
                  <circle cx={legR.x} cy={legR.y} r="2.2" fill="#FFD47A" opacity="0.8" />
                </>
              )}
              {/* Segment ellipse */}
              <ellipse
                cx={seg.x} cy={seg.y}
                rx={w} ry={h}
                fill={shade}
                transform={`rotate(${ang + 90}, ${seg.x}, ${seg.y})`}
              />
              {/* Segment texture dot */}
              {!isHead && (
                <circle cx={seg.x} cy={seg.y} r={1.5}
                  fill="white" opacity="0.18" />
              )}
            </g>
          );
        })}

        {/* Antennae */}
        <path
          d={`M ${antennaLRoot.x} ${antennaLRoot.y} Q ${head.x + fwd.x * 15 - right.x * 12} ${head.y + fwd.y * 15 - right.y * 12} ${antennaL.x} ${antennaL.y}`}
          stroke="#F4BFC9" strokeWidth="2" strokeLinecap="round" fill="none"
        />
        <circle cx={antennaL.x} cy={antennaL.y} r="3.5" fill="#FFD47A" />

        <path
          d={`M ${antennaRRoot.x} ${antennaRRoot.y} Q ${head.x + fwd.x * 15 + right.x * 12} ${head.y + fwd.y * 15 + right.y * 12} ${antennaR.x} ${antennaR.y}`}
          stroke="#F4BFC9" strokeWidth="2" strokeLinecap="round" fill="none"
        />
        <circle cx={antennaR.x} cy={antennaR.y} r="3.5" fill="#FFD47A" />

        {/* Eyes */}
        <ellipse cx={eyeL.x} cy={eyeL.y} rx={5} ry={blink ? 1.2 : 5.5} fill="white" />
        <ellipse cx={eyeR.x} cy={eyeR.y} rx={5} ry={blink ? 1.2 : 5.5} fill="white" />
        {!blink && (
          <>
            <circle cx={eyeL.x + fwd.x * 1.5} cy={eyeL.y + fwd.y * 1.5} r={2.8} fill="#0D0D0D" />
            <circle cx={eyeR.x + fwd.x * 1.5} cy={eyeR.y + fwd.y * 1.5} r={2.8} fill="#0D0D0D" />
            {/* Shine */}
            <circle cx={eyeL.x + fwd.x * 2.5 - right.x * 0.5} cy={eyeL.y + fwd.y * 2.5 - right.y * 0.5} r={1.1} fill="white" />
            <circle cx={eyeR.x + fwd.x * 2.5 + right.x * 0.5} cy={eyeR.y + fwd.y * 2.5 + right.y * 0.5} r={1.1} fill="white" />
          </>
        )}

        {/* Mouth — cute UwU curve */}
        <path
          d={`M ${mouthC.x - right.x * 4} ${mouthC.y - right.y * 4}
              Q ${mouthC.x + fwd.x * 3} ${mouthC.y + fwd.y * 3}
                ${mouthC.x + right.x * 4} ${mouthC.y + right.y * 4}`}
          stroke="#0D0D0D" strokeWidth="1.8" strokeLinecap="round" fill="none"
        />

        {/* Cheek blush */}
        <ellipse
          cx={head.x - right.x * 11} cy={head.y - right.y * 11}
          rx="5" ry="3"
          fill="#FFD47A" opacity="0.5"
        />
        <ellipse
          cx={head.x + right.x * 11} cy={head.y + right.y * 11}
          rx="5" ry="3"
          fill="#FFD47A" opacity="0.5"
        />
      </svg>
    </div>
  );
}
