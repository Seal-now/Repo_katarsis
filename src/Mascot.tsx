import { useEffect, useRef, useState } from "react";

const QUIPS = [
  "найдём твоего 🔥",
  "ЕГЭ на 90+? 💅",
  "вайб важен ✨",
  "МГУ ждёт 👀",
  "без паники 🫶",
  "топ преп рядом",
  "учёба = кайф?",
  "пройди тест!",
];

export function Mascot() {
  const targetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const smoothRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const rafRef = useRef<number>(0);
  const [pos, setPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [blink, setBlink] = useState(false);
  const [quip, setQuip] = useState<string | null>(null);
  const [squeeze, setSqueeze] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let moved = false;
    const onMove = (e: MouseEvent) => {
      if (!moved) { setVisible(true); moved = true; }
      targetRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const animate = () => {
      const dx = targetRef.current.x - smoothRef.current.x;
      const dy = targetRef.current.y - smoothRef.current.y;
      smoothRef.current = {
        x: smoothRef.current.x + dx * 0.07,
        y: smoothRef.current.y + dy * 0.07,
      };
      setPos({ x: smoothRef.current.x, y: smoothRef.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    // Blink
    const blinkLoop = () => {
      const delay = 2500 + Math.random() * 2000;
      setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); blinkLoop(); }, 130);
      }, delay);
    };
    blinkLoop();

    // Quips
    const quipInterval = setInterval(() => {
      const text = QUIPS[Math.floor(Math.random() * QUIPS.length)];
      setSqueeze(true);
      setTimeout(() => setSqueeze(false), 300);
      setQuip(text);
      setTimeout(() => setQuip(null), 2200);
    }, 7000);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
      clearInterval(quipInterval);
    };
  }, []);

  if (!visible) return null;

  const scaleX = squeeze ? 1.15 : 1;
  const scaleY = squeeze ? 0.88 : 1;

  return (
    <div
      className="fixed pointer-events-none z-50 hidden md:block"
      style={{ left: pos.x - 44, top: pos.y - 70, willChange: "transform" }}
    >
      {/* Speech bubble */}
      <div
        className="absolute font-display text-[10px] font-bold whitespace-nowrap px-2.5 py-1 rounded-xl transition-all duration-200"
        style={{
          bottom: "calc(100% + 6px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#FFD47A",
          color: "#0D0D0D",
          opacity: quip ? 1 : 0,
          scale: quip ? "1" : "0.8",
          transformOrigin: "bottom center",
          boxShadow: "0 2px 12px rgba(255,212,122,0.4)",
          pointerEvents: "none",
        }}
      >
        {quip}
        {/* Tail */}
        <span
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: -6,
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "6px solid #FFD47A",
          }}
        />
      </div>

      {/* Mascot SVG */}
      <svg
        width="88"
        height="96"
        viewBox="0 0 88 96"
        fill="none"
        style={{
          transform: `scaleX(${scaleX}) scaleY(${scaleY})`,
          transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
          filter: "drop-shadow(0 8px 24px rgba(244,191,201,0.35))",
        }}
      >
        {/* Shadow */}
        <ellipse cx="44" cy="91" rx="22" ry="5" fill="#F4BFC9" opacity="0.18" />

        {/* Body — slightly irregular blob */}
        <path
          d="M44 6
             C62 6 74 18 76 36
             C78 52 74 70 62 80
             C56 86 50 90 44 90
             C38 90 32 86 26 80
             C14 70 10 52 12 36
             C14 18 26 6 44 6Z"
          fill="#F4BFC9"
        />

        {/* Inner belly highlight */}
        <ellipse cx="44" cy="58" rx="18" ry="14" fill="white" opacity="0.12" />

        {/* Left eye white */}
        <ellipse cx="30" cy="42" rx="9" ry={blink ? 1.5 : 10} fill="white" />
        {/* Right eye white */}
        <ellipse cx="58" cy="42" rx="9" ry={blink ? 1.5 : 10} fill="white" />

        {!blink && (
          <>
            {/* Left pupil */}
            <circle cx="32" cy="43" r="5" fill="#0D0D0D" />
            {/* Right pupil */}
            <circle cx="60" cy="43" r="5" fill="#0D0D0D" />
            {/* Left shine */}
            <circle cx="34" cy="40" r="2" fill="white" />
            {/* Right shine */}
            <circle cx="62" cy="40" r="2" fill="white" />
            {/* Small extra shine */}
            <circle cx="30" cy="45" r="1" fill="white" opacity="0.6" />
            <circle cx="58" cy="45" r="1" fill="white" opacity="0.6" />
          </>
        )}

        {/* Rosy cheeks */}
        <ellipse cx="19" cy="56" rx="6" ry="4" fill="#FFD47A" opacity="0.55" />
        <ellipse cx="69" cy="56" rx="6" ry="4" fill="#FFD47A" opacity="0.55" />

        {/* Smile */}
        <path
          d="M34 66 Q44 76 54 66"
          stroke="#0D0D0D"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Little nub arms */}
        <ellipse cx="7" cy="52" rx="7" ry="9" fill="#F4BFC9" />
        <ellipse cx="81" cy="52" rx="7" ry="9" fill="#F4BFC9" />

        {/* Star sparkle top-right */}
        <path
          d="M70 14 L71.2 17.5 L75 17.5 L72.2 19.8 L73.4 23.5 L70 21.2 L66.6 23.5 L67.8 19.8 L65 17.5 L68.8 17.5Z"
          fill="#FFD47A"
          opacity="0.9"
        />
        {/* Tiny star bottom-left */}
        <path
          d="M18 72 L18.8 74.3 L21 74.3 L19.4 75.6 L20.2 78 L18 76.5 L15.8 78 L16.6 75.6 L15 74.3 L17.2 74.3Z"
          fill="#FFD47A"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
