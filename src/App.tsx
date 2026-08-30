import { useState, useEffect } from "react";
import { TUTORS, calcMatch, PINK, YELLOW, MINT, LAVENDER, type Tutor } from "./data/tutors";

// ─── palette ─────────────────────────────────────────────────────────────────
const BG = "#FFFAF5";
const DARK = "#1A0A10";
const WHITE = "#FFFFFF";
const BORDER = "#1A0A10";

// ─── quiz data ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: "vibe",
    tag: "АТМОСФЕРА",
    q: "Какой вайб на занятии тебе нужен?",
    opts: [
      { v: "chill", emoji: "🛋️", l: "Чилл", s: "тихо и уютно" },
      { v: "hype", emoji: "⚡", l: "Энергия", s: "заряженно и быстро" },
      { v: "focus", emoji: "🎯", l: "Фокус", s: "строго по делу" },
      { v: "creative", emoji: "🎨", l: "Творчество", s: "нестандартно" },
    ],
  },
  {
    id: "style",
    tag: "КАК ТЫ УЧИШЬСЯ",
    q: "Как тебе лучше всего заходит?",
    opts: [
      { v: "visual", emoji: "👁️", l: "Картинками", s: "схемы, мемы, видео" },
      { v: "talk", emoji: "🗣️", l: "Разговором", s: "объяснение голосом" },
      { v: "hands", emoji: "🖐️", l: "Практикой", s: "сразу делаю сам" },
      { v: "text", emoji: "📖", l: "Текстом", s: "читаю и конспектирую" },
    ],
  },
  {
    id: "pace",
    tag: "ТЕМП",
    q: "Твой ритм работы?",
    opts: [
      { v: "slow", emoji: "🐢", l: "Вдумчиво", s: "главное — понять" },
      { v: "mid", emoji: "🚶", l: "Умеренно", s: "баланс всего" },
      { v: "fast", emoji: "🚀", l: "Газ в пол", s: "побольше и быстрее" },
      { v: "wave", emoji: "🌊", l: "По волне", s: "зависит от настроения" },
    ],
  },
  {
    id: "feedback",
    tag: "ФИДБЭК",
    q: "Как тебе говорить об ошибках?",
    opts: [
      { v: "honest", emoji: "🔥", l: "Честно", s: "как есть, без сахара" },
      { v: "soft", emoji: "🤗", l: "Мягко", s: "бережно и с поддержкой" },
      { v: "example", emoji: "💡", l: "На примере", s: "покажи — не говори" },
      { v: "written", emoji: "📝", l: "Письменно", s: "комментарии в тексте" },
    ],
  },
  {
    id: "goal",
    tag: "ЗАЧЕМ ТЫ ТУТ",
    q: "Что тебя мотивирует учиться?",
    opts: [
      { v: "exam", emoji: "📊", l: "Экзамен", s: "нужна оценка/результат" },
      { v: "interest", emoji: "🔮", l: "Интерес", s: "просто хочу понять" },
      { v: "career", emoji: "💼", l: "Карьера", s: "это нужно для работы" },
      { v: "vibe", emoji: "✨", l: "Атмосфера", s: "люблю сам процесс" },
    ],
  },
];

// ─── Marquee ──────────────────────────────────────────────────────────────────
function Marquee() {
  const items = ["🧠 психосовместимость", "✨ твой вайб", "🎯 правильный темп", "💬 стиль общения", "🚀 твой репетитор", "🔮 без слепых свиданий"];
  const doubled = [...items, ...items];
  return (
    <div
      className="overflow-hidden py-3 border-y-2"
      style={{ borderColor: BORDER, background: YELLOW }}
    >
      <div className="marquee-track flex gap-8 whitespace-nowrap w-max">
        {doubled.map((t, i) => (
          <span key={i} className="font-display text-xs font-bold tracking-wide" style={{ color: DARK }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Quiz card ────────────────────────────────────────────────────────────────
function QuizCard({ step, value, onChange }: {
  step: typeof STEPS[0]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="w-full max-w-lg mx-auto px-5">
      <span
        className="font-mono-label text-xs font-bold uppercase tracking-widest inline-block px-3 py-1.5 rounded-full mb-5 border-2"
        style={{ background: PINK, color: DARK, borderColor: BORDER }}
      >
        {step.tag}
      </span>
      <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-7" style={{ color: DARK }}>
        {step.q}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {step.opts.map((opt) => {
          const sel = value === opt.v;
          return (
            <button
              key={opt.v}
              onClick={() => onChange(opt.v)}
              className="text-left p-4 rounded-2xl border-2 transition-all duration-150 active:scale-95 hover:scale-[1.02]"
              style={{
                background: sel ? DARK : WHITE,
                borderColor: sel ? DARK : BORDER,
                color: sel ? WHITE : DARK,
                boxShadow: sel ? `4px 4px 0 ${PINK}` : "3px 3px 0 #1A0A1022",
              }}
            >
              <div className="text-2xl mb-2">{opt.emoji}</div>
              <div className="font-display text-xs font-bold leading-tight">{opt.l}</div>
              <div className="text-xs mt-0.5 opacity-60 font-medium">{opt.s}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Match badge ──────────────────────────────────────────────────────────────
function MatchBadge({ match }: { match: number }) {
  const color = match >= 80 ? PINK : match >= 50 ? YELLOW : MINT;
  return (
    <span
      className="font-mono-label text-xs font-bold px-2.5 py-1 rounded-full border-2 shrink-0"
      style={{ background: color, color: DARK, borderColor: BORDER }}
    >
      {match}%
    </span>
  );
}

// ─── Tutor card ───────────────────────────────────────────────────────────────
function TutorCard({ tutor, answered }: { tutor: Tutor & { match: number }; answered: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-3xl overflow-hidden border-2 transition-all duration-200 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
      style={{
        background: WHITE,
        borderColor: BORDER,
        boxShadow: open ? `6px 6px 0 ${tutor.color}` : "4px 4px 0 #1A0A1022",
      }}
      onClick={() => setOpen(!open)}
    >
      {/* Match bar */}
      {answered && (
        <div className="h-1.5 w-full" style={{ background: "#F0E8E0" }}>
          <div
            className="h-full transition-all duration-700"
            style={{ width: `${tutor.match}%`, background: tutor.color, borderRight: `2px solid ${BORDER}` }}
          />
        </div>
      )}

      <div className="p-4 sm:p-5 flex gap-3 sm:gap-4 items-start">
        {/* Photo */}
        <div className="relative shrink-0">
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2"
            style={{ borderColor: BORDER, background: tutor.color + "66" }}
          >
            <img src={tutor.photo} alt={tutor.name} className="w-full h-full object-cover" />
          </div>
          <span className="absolute -bottom-1.5 -right-1.5 text-lg leading-none">{tutor.emoji}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-display text-sm font-bold" style={{ color: DARK }}>{tutor.name}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: "#7A4A5A" }}>{tutor.subject}</p>
            </div>
            {answered && <MatchBadge match={tutor.match} />}
          </div>

          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2">
            <span className="text-xs font-bold" style={{ color: "#D4700A" }}>★ {tutor.rating}</span>
            <span className="text-xs font-medium" style={{ color: "#AAA" }}>{tutor.sessions} занятий</span>
            <span className="font-mono-label text-xs font-bold" style={{ color: DARK }}>{tutor.price}/ч</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="px-4 sm:px-5 pb-4 flex flex-wrap gap-1.5">
        {tutor.tags.map((t) => (
          <span
            key={t}
            className="text-xs font-semibold px-2.5 py-1 rounded-full border"
            style={{ background: tutor.color + "33", color: DARK, borderColor: tutor.color }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Chevron hint */}
      <div className="px-4 sm:px-5 pb-3 flex items-center gap-1.5">
        <span className="text-xs font-medium" style={{ color: "#AAA" }}>
          {open ? "Свернуть" : "Подробнее"}
        </span>
        <span style={{ color: "#AAA", fontSize: 10 }}>{open ? "▲" : "▼"}</span>
      </div>

      {/* Expanded */}
      {open && (
        <div className="px-4 sm:px-5 pb-5 border-t-2" style={{ borderColor: BORDER }}>
          <p className="text-sm leading-relaxed my-4 font-medium" style={{ color: "#5A2A3A" }}>{tutor.bio}</p>
          <a
            href={`https://t.me/${tutor.telegram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-display text-sm font-bold transition-all active:scale-95 border-2"
            style={{ background: DARK, color: WHITE, borderColor: DARK }}
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.4l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.159z"/>
            </svg>
            Написать в Telegram
          </a>
        </div>
      )}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
type Screen = "home" | "quiz" | "results";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"all" | "top">("all");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const currentStep = STEPS[step];
  const currentAnswer = answers[currentStep?.id] ?? "";
  const answered = Object.keys(answers).length === STEPS.length;
  const progress = ((step + 1) / STEPS.length) * 100;

  const tutorsWithMatch = TUTORS.map((t) => ({ ...t, match: calcMatch(t, answers) }))
    .sort((a, b) => b.match - a.match);
  const displayed = filter === "top" ? tutorsWithMatch.filter((t) => t.match >= 60) : tutorsWithMatch;

  function startQuiz() {
    setAnswers({});
    setStep(0);
    setScreen("quiz");
    window.scrollTo(0, 0);
  }

  // ── HOME ────────────────────────────────────────────────────────────────────
  if (screen === "home") {
    return (
      <div style={{ background: BG, minHeight: "100%", color: DARK }}>
        {/* Nav */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 py-3.5 transition-all duration-300"
          style={{
            background: scrolled ? WHITE + "EE" : "transparent",
            backdropFilter: scrolled ? "blur(12px)" : "none",
            borderBottom: scrolled ? `2px solid ${BORDER}` : "2px solid transparent",
          }}
        >
          <span className="font-display text-base font-black tracking-tight" style={{ color: DARK }}>
            ка<span style={{ color: PINK }}>та</span>рсис
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setScreen("results")}
              className="font-display text-xs font-bold px-3 sm:px-4 py-2 rounded-full border-2 transition-all active:scale-95 hidden sm:block"
              style={{ borderColor: BORDER, color: DARK }}
            >
              Все репетиторы
            </button>
            <button
              onClick={startQuiz}
              className="font-display text-xs font-bold px-4 sm:px-5 py-2.5 rounded-full border-2 transition-all active:scale-95"
              style={{ background: DARK, color: WHITE, borderColor: DARK }}
            >
              Найти своего →
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-24 sm:pt-28 pb-12 sm:pb-16 px-5 sm:px-8 lg:px-12 relative overflow-hidden">
          {/* Geometric background shapes */}
          <div className="absolute top-16 right-4 sm:right-12 w-48 sm:w-72 h-48 sm:h-72 rounded-full opacity-30 pointer-events-none" style={{ background: PINK, filter: "blur(60px)" }} />
          <div className="absolute bottom-0 left-0 w-40 sm:w-56 h-40 sm:h-56 rounded-full opacity-25 pointer-events-none" style={{ background: YELLOW, filter: "blur(50px)" }} />
          <div className="absolute top-40 left-1/3 w-32 h-32 rounded-full opacity-20 pointer-events-none" style={{ background: MINT, filter: "blur(40px)" }} />

          <div className="max-w-5xl mx-auto relative">
            {/* Floating stickers — desktop only */}
            <div className="float absolute -right-2 top-4 hidden lg:flex">
              <div className="w-16 h-16 rounded-2xl rotate-12 flex items-center justify-center text-2xl border-2 shadow-lg" style={{ background: YELLOW, borderColor: BORDER }}>✨</div>
            </div>
            <div className="float-reverse absolute right-32 top-48 hidden lg:flex">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 shadow-lg" style={{ background: PINK, borderColor: BORDER }}>♥</div>
            </div>
            <div className="float absolute left-0 top-28 hidden xl:flex">
              <div className="w-10 h-10 rounded-xl -rotate-6 flex items-center justify-center text-base border-2 shadow-md" style={{ background: MINT, borderColor: BORDER }}>🧠</div>
            </div>

            {/* Label */}
            <div
              className="font-mono-label text-xs uppercase tracking-widest inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 border-2"
              style={{ background: MINT, color: DARK, borderColor: BORDER }}
            >
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: DARK }} />
              подбор репетитора по вайбу
            </div>

            {/* Headline */}
            <h1 className="font-display font-black leading-[0.9] mb-6 tracking-tight" style={{ fontSize: "clamp(2.2rem, 7vw, 5.5rem)" }}>
              найди репетитора,{" "}
              <span
                className="inline-block px-2 rounded-lg -skew-x-2 leading-none"
                style={{ background: PINK, color: DARK }}
              >
                с которым
              </span>
              <br />
              <span style={{ color: DARK }}>кайфово</span>{" "}
              <span
                className="relative inline-block"
                style={{ WebkitTextStroke: `3px ${DARK}`, color: "transparent" }}
              >
                учиться
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mb-8 font-medium" style={{ color: "#7A4A5A" }}>
              Хороших репетиторов много. Найти психологически совместимого — другая история.{" "}
              <span style={{ color: DARK, fontWeight: 700 }}>Мы сделали это за 5 вопросов.</span>
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={startQuiz}
                className="pulse-btn font-display font-bold text-sm px-6 sm:px-8 py-4 rounded-2xl border-2 transition-all active:scale-95"
                style={{ background: DARK, color: WHITE, borderColor: DARK, boxShadow: `5px 5px 0 ${PINK}` }}
              >
                Пройти тест →
              </button>
              <button
                onClick={() => setScreen("results")}
                className="font-display font-bold text-sm px-6 sm:px-8 py-4 rounded-2xl border-2 transition-all active:scale-95 hover:bg-black hover:text-white"
                style={{ borderColor: BORDER, color: DARK, background: WHITE }}
              >
                Смотреть всех
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-5 sm:gap-8 mt-10">
              {[["240+", "репетиторов", YELLOW], ["4.8★", "средний рейтинг", PINK], ["5 мин", "на подбор", MINT]].map(([n, l, c]) => (
                <div key={l} className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl border-2 flex items-center justify-center" style={{ background: c as string, borderColor: BORDER }}>
                    <span className="font-display text-xs font-black" style={{ color: DARK }}>{n}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: "#7A4A5A" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Marquee />

        {/* Problem vs Solution */}
        <section className="px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Pain */}
              <div className="rounded-3xl p-6 sm:p-8 border-2" style={{ background: WHITE, borderColor: BORDER, boxShadow: "5px 5px 0 #F0E0E8" }}>
                <div className="text-4xl mb-4">😵‍💫</div>
                <h3 className="font-display text-lg sm:text-xl font-bold mb-4" style={{ color: DARK }}>
                  Как выбирают обычно
                </h3>
                <ul className="space-y-2.5">
                  {["Смотришь рейтинг — непонятно", "Читаешь описание — одинаковое у всех", "Пробуешь — не заходит", "Ищёшь снова..."].map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm font-medium" style={{ color: "#9A7A8A" }}>
                      <span className="mt-0.5 font-bold text-red-400">✕</span> {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solution */}
              <div
                className="rounded-3xl p-6 sm:p-8 border-2"
                style={{ background: PINK, borderColor: BORDER, boxShadow: `5px 5px 0 ${DARK}` }}
              >
                <div className="text-4xl mb-4">✨</div>
                <h3 className="font-display text-lg sm:text-xl font-bold mb-4" style={{ color: DARK }}>
                  Как у нас
                </h3>
                <ul className="space-y-2.5">
                  {["Отвечаешь на 5 вопросов о себе", "Алгоритм ищет совместимость", "Видишь % совпадения психопрофиля", "Первое занятие — и ты уже знаешь"].map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm font-medium" style={{ color: DARK }}>
                      <span className="mt-0.5 font-bold">✓</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-5 sm:px-8 lg:px-12 py-4 pb-16 sm:pb-20">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono-label text-xs uppercase tracking-widest mb-2 font-bold" style={{ color: "#AAA" }}>как работает</p>
            <h2 className="font-display font-black mb-8 sm:mb-10" style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", color: DARK }}>
              три шага до <span style={{ color: PINK, WebkitTextStroke: `2px ${DARK}` }}>своего</span>
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { n: "01", emoji: "🧠", title: "Тест", desc: "5 быстрых вопросов про твой стиль, вайб и цель", color: YELLOW },
                { n: "02", emoji: "🔮", title: "Подбор", desc: "Алгоритм считает психологическую совместимость", color: PINK },
                { n: "03", emoji: "🚀", title: "Поехали", desc: "Пробное занятие — и ты чувствуешь, твоё или нет", color: MINT },
              ].map((s, i) => (
                <div
                  key={s.n}
                  className="rounded-3xl p-6 border-2 relative overflow-hidden"
                  style={{ background: s.color, borderColor: BORDER, boxShadow: i === 1 ? `5px 5px 0 ${DARK}` : "none" }}
                >
                  <div
                    className="absolute top-3 right-4 font-display text-5xl font-black opacity-20"
                    style={{ color: DARK }}
                  >
                    {s.n}
                  </div>
                  <div className="text-3xl mb-3">{s.emoji}</div>
                  <p className="font-display text-base sm:text-lg font-bold mb-1.5" style={{ color: DARK }}>{s.title}</p>
                  <p className="text-sm font-medium" style={{ color: DARK + "BB" }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tutor preview */}
        <section className="px-5 sm:px-8 lg:px-12 pb-16 sm:pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between mb-6 sm:mb-8 gap-4">
              <h2 className="font-display font-black" style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)", color: DARK }}>
                наши репетиторы
              </h2>
              <button
                onClick={() => setScreen("results")}
                className="font-display text-xs font-bold px-4 py-2 rounded-full border-2 shrink-0 transition-all active:scale-95"
                style={{ borderColor: BORDER, color: DARK }}
              >
                Все →
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TUTORS.slice(0, 3).map((t) => (
                <div key={t.id} className="rounded-3xl p-5 border-2 flex gap-4 items-start" style={{ background: WHITE, borderColor: BORDER, boxShadow: `4px 4px 0 ${t.color}` }}>
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2" style={{ borderColor: BORDER }}>
                      <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="absolute -bottom-1.5 -right-1.5 text-lg">{t.emoji}</span>
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold" style={{ color: DARK }}>{t.name}</p>
                    <p className="text-xs font-medium mb-2" style={{ color: "#7A4A5A" }}>{t.subject}</p>
                    <p className="text-xs font-bold" style={{ color: "#D4700A" }}>★ {t.rating} · {t.price}/ч</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 sm:px-8 lg:px-12 pb-16 sm:pb-20">
          <div
            className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 md:p-16 text-center relative overflow-hidden border-2"
            style={{ background: DARK, borderColor: BORDER, boxShadow: `8px 8px 0 ${YELLOW}` }}
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20" style={{ background: PINK }} />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10" style={{ background: YELLOW }} />
            <span className="font-mono-label text-xs uppercase tracking-widest px-3 py-1 rounded-full border inline-block mb-5" style={{ borderColor: "#444", color: "#AAA" }}>
              начни прямо сейчас
            </span>
            <h2 className="font-display font-black leading-tight mb-4 relative z-10" style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)", color: WHITE }}>
              готов найти<br />
              <span style={{ color: YELLOW }}>своего человека?</span>
            </h2>
            <p className="text-sm mb-8 relative z-10 font-medium" style={{ color: "#AAA" }}>
              5 вопросов · бесплатно · никаких регистраций
            </p>
            <button
              onClick={startQuiz}
              className="relative z-10 font-display font-black text-sm px-10 py-4 rounded-2xl border-2 transition-all active:scale-95"
              style={{ background: YELLOW, color: DARK, borderColor: YELLOW, boxShadow: `4px 4px 0 ${PINK}` }}
            >
              Начать тест →
            </button>
          </div>
        </section>

        <footer className="px-5 sm:px-8 py-6 border-t-2 flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderColor: BORDER }}>
          <span className="font-display text-sm font-black" style={{ color: DARK }}>ка<span style={{ color: PINK }}>та</span>рсис</span>
          <span className="text-xs font-medium" style={{ color: "#AAA" }}>© 2026 · подбор репетиторов по психологической совместимости</span>
        </footer>
      </div>
    );
  }

  // ── QUIZ ────────────────────────────────────────────────────────────────────
  if (screen === "quiz") {
    return (
      <div className="min-h-full flex flex-col" style={{ background: BG }}>
        {/* Top bar */}
        <div className="px-5 py-4 flex items-center justify-between border-b-2" style={{ borderColor: BORDER, background: WHITE }}>
          <button
            onClick={() => setScreen("home")}
            className="font-display text-sm font-black"
            style={{ color: DARK }}
          >
            ка<span style={{ color: PINK }}>та</span>рсис
          </button>
          <span className="font-mono-label text-xs font-bold" style={{ color: "#AAA" }}>
            {step + 1} / {STEPS.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5" style={{ background: "#F0E8E0" }}>
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${PINK}, ${YELLOW})`, borderRight: `2px solid ${DARK}` }}
          />
        </div>

        {/* Step dots */}
        <div className="flex gap-2 justify-center pt-5">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className="h-2 rounded-full transition-all duration-300 border"
              style={{
                width: i === step ? "28px" : "8px",
                background: i < step ? DARK : i === step ? PINK : "#E8D8E0",
                borderColor: i <= step ? DARK : "transparent",
              }}
            />
          ))}
        </div>

        {/* Card */}
        <div className="flex-1 flex items-center py-8">
          <QuizCard
            step={currentStep}
            value={currentAnswer}
            onChange={(v) => setAnswers((a) => ({ ...a, [currentStep.id]: v }))}
          />
        </div>

        {/* Navigation buttons */}
        <div className="px-5 pb-8 sm:pb-10 flex gap-3 max-w-lg mx-auto w-full">
          <button
            onClick={() => (step > 0 ? setStep((s) => s - 1) : setScreen("home"))}
            className="flex-1 py-3.5 rounded-2xl font-display text-sm font-bold border-2 transition-all active:scale-95"
            style={{ borderColor: BORDER, color: DARK, background: WHITE }}
          >
            ←
          </button>
          <button
            onClick={() => {
              if (!currentAnswer) return;
              if (step < STEPS.length - 1) setStep((s) => s + 1);
              else setScreen("results");
            }}
            disabled={!currentAnswer}
            className="flex-[3] py-3.5 rounded-2xl font-display text-sm font-bold border-2 transition-all active:scale-95 disabled:opacity-30"
            style={{
              background: currentAnswer ? DARK : "#E8D8E0",
              color: currentAnswer ? WHITE : "#AAA",
              borderColor: currentAnswer ? DARK : "transparent",
              boxShadow: currentAnswer ? `4px 4px 0 ${PINK}` : "none",
            }}
          >
            {step === STEPS.length - 1 ? "Показать результат →" : "Дальше →"}
          </button>
        </div>
      </div>
    );
  }

  // ── RESULTS ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: BG, minHeight: "100%", color: DARK }}>
      <nav
        className="flex items-center justify-between px-5 sm:px-8 py-4 border-b-2 sticky top-0 z-40"
        style={{ background: WHITE + "EE", backdropFilter: "blur(12px)", borderColor: BORDER }}
      >
        <button onClick={() => setScreen("home")} className="font-display text-sm font-black" style={{ color: DARK }}>
          ка<span style={{ color: PINK }}>та</span>рсис
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={startQuiz}
            className="font-display text-xs font-bold px-4 py-2 rounded-full border-2 transition-all active:scale-95"
            style={{ borderColor: BORDER, color: DARK }}
          >
            ↺ заново
          </button>
          <button
            onClick={() => setScreen("home")}
            className="font-display text-xs font-bold px-4 py-2 rounded-full border-2 transition-all active:scale-95"
            style={{ background: DARK, color: WHITE, borderColor: DARK }}
          >
            На главную
          </button>
        </div>
      </nav>

      <div className="px-5 sm:px-8 lg:px-12 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          {answered ? (
            <>
              <div
                className="font-mono-label text-xs uppercase tracking-widest inline-block px-3 py-1.5 rounded-full mb-3 border-2"
                style={{ background: MINT, color: DARK, borderColor: BORDER }}
              >
                ✓ твой профиль готов
              </div>
              <h1 className="font-display font-black" style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", color: DARK }}>
                вот твои репетиторы 🎯
              </h1>
            </>
          ) : (
            <>
              <h1 className="font-display font-black mb-2" style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", color: DARK }}>
                все репетиторы
              </h1>
              <p className="text-sm font-medium" style={{ color: "#7A4A5A" }}>
                <button onClick={startQuiz} style={{ color: PINK }} className="underline underline-offset-2 font-bold">пройди тест</button>
                {" "}чтобы увидеть совместимость
              </p>
            </>
          )}
        </div>

        {/* Profile recap */}
        {answered && (
          <div
            className="mb-6 p-4 rounded-2xl flex flex-wrap gap-2 border-2"
            style={{ background: WHITE, borderColor: BORDER }}
          >
            {STEPS.map((s) => {
              const opt = s.opts.find((o) => o.v === answers[s.id]);
              return opt ? (
                <span key={s.id} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border" style={{ background: PINK + "33", color: DARK, borderColor: PINK }}>
                  {opt.emoji} {opt.l}
                </span>
              ) : null;
            })}
          </div>
        )}

        {/* Filter */}
        {answered && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {([["all", "Все"], ["top", "60%+ совпадение"]] as const).map(([v, l]) => (
              <button
                key={v}
                onClick={() => setFilter(v)}
                className="font-display text-xs font-bold px-4 py-2 rounded-full border-2 transition-all"
                style={
                  filter === v
                    ? { background: DARK, color: WHITE, borderColor: DARK, boxShadow: `3px 3px 0 ${PINK}` }
                    : { background: WHITE, color: DARK, borderColor: BORDER }
                }
              >
                {l}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((t) => (
            <TutorCard key={t.id} tutor={t} answered={answered} />
          ))}
        </div>

        {displayed.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🤔</div>
            <p className="font-display text-lg font-bold mb-2" style={{ color: DARK }}>Никто не прошёл фильтр</p>
            <button onClick={() => setFilter("all")} className="font-display text-sm font-bold underline" style={{ color: PINK }}>
              Показать всех →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
