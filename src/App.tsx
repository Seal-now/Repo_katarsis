import { useState, useEffect, useRef } from "react";
import { TUTORS, SUBJECTS, calcMatch, PINK, YELLOW, type Tutor } from "./data/tutors";

// ─── palette ─────────────────────────────────────────────────────────────────
const DARK = "#0D0D0D";
const CARD_BG = "#161616";
const CARD2 = "#1E1E1E";

// ─── quiz steps ───────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: "vibe",
    tag: "АТМОСФЕРА",
    q: "Какой вайб на занятии тебе нужен?",
    opts: [
      { v: "chill",    emoji: "🛋️", l: "Чилл",       s: "тихо и уютно" },
      { v: "hype",     emoji: "⚡",  l: "Энергия",    s: "заряженно и быстро" },
      { v: "focus",    emoji: "🎯",  l: "Фокус",      s: "строго по делу" },
      { v: "creative", emoji: "🎨",  l: "Творчество", s: "нестандартно" },
    ],
  },
  {
    id: "style",
    tag: "КАК ТЫ УЧИШЬСЯ",
    q: "Как тебе лучше всего заходит?",
    opts: [
      { v: "visual", emoji: "👁️",  l: "Картинками", s: "схемы, мемы, видео" },
      { v: "talk",   emoji: "🗣️",  l: "Разговором", s: "объяснение голосом" },
      { v: "hands",  emoji: "🖐️",  l: "Практикой",  s: "сразу делаю сам" },
      { v: "text",   emoji: "📖",  l: "Текстом",    s: "читаю и конспектирую" },
    ],
  },
  {
    id: "pace",
    tag: "ТЕМП",
    q: "Твой ритм работы?",
    opts: [
      { v: "slow", emoji: "🐢", l: "Вдумчиво",  s: "главное — понять" },
      { v: "mid",  emoji: "🚶", l: "Умеренно",  s: "баланс всего" },
      { v: "fast", emoji: "🚀", l: "Газ в пол", s: "побольше и быстрее" },
      { v: "wave", emoji: "🌊", l: "По волне",  s: "зависит от настроения" },
    ],
  },
  {
    id: "feedback",
    tag: "ФИДБЭК",
    q: "Как тебе говорить об ошибках?",
    opts: [
      { v: "honest",  emoji: "🔥", l: "Честно",     s: "как есть, без сахара" },
      { v: "soft",    emoji: "🤗", l: "Мягко",      s: "бережно и с поддержкой" },
      { v: "example", emoji: "💡", l: "На примере", s: "покажи — не говори" },
      { v: "written", emoji: "📝", l: "Письменно",  s: "комментарии в тексте" },
    ],
  },
  {
    id: "goal",
    tag: "ЗАЧЕМ ТЫ ТУТ",
    q: "Что тебя мотивирует учиться?",
    opts: [
      { v: "exam",     emoji: "📊", l: "Экзамен",   s: "нужна оценка/результат" },
      { v: "interest", emoji: "🔮", l: "Интерес",   s: "просто хочу понять" },
      { v: "career",   emoji: "💼", l: "Карьера",   s: "это нужно для работы" },
      { v: "vibe",     emoji: "✨", l: "Атмосфера", s: "люблю сам процесс" },
    ],
  },
];

// ─── Marquee ──────────────────────────────────────────────────────────────────
function Marquee() {
  const items = [
    "🧠 психосовместимость",
    "✨ твой вайб",
    "🎯 правильный темп",
    "💬 стиль общения",
    "🚀 твой репетитор",
    "🔮 без слепых свиданий",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-3 border-y" style={{ borderColor: "#2A2A2A", background: "#111" }}>
      <div className="marquee-track flex gap-8 whitespace-nowrap w-max">
        {doubled.map((t, i) => (
          <span key={i} className="font-display text-xs font-bold tracking-wide" style={{ color: "#555" }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Subject step ─────────────────────────────────────────────────────────────
function SubjectStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = query.trim().length === 0
    ? SUBJECTS
    : SUBJECTS.filter((s) =>
        s.label.toLowerCase().includes(query.toLowerCase()) ||
        s.group.toLowerCase().includes(query.toLowerCase())
      );

  // Group by group name for display
  const groups = filtered.reduce<Record<string, typeof SUBJECTS>>((acc, s) => {
    (acc[s.group] = acc[s.group] ?? []).push(s);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-lg mx-auto px-5">
      <span
        className="font-mono-label text-xs uppercase tracking-widest inline-block px-3 py-1.5 rounded-full mb-5"
        style={{ background: YELLOW + "33", color: YELLOW }}
      >
        ПРЕДМЕТ
      </span>
      <h2
        className="font-display font-bold leading-tight mb-5"
        style={{ color: "#F0EDE8", fontSize: "clamp(1.1rem, 4vw, 1.6rem)" }}
      >
        Какой предмет тебе нужен?
      </h2>

      {/* Search input */}
      <div className="relative mb-4">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg pointer-events-none">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Например: Физика ЕГЭ..."
          className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 outline-none text-sm font-medium transition-all"
          style={{
            background: "#1E1E1E",
            borderColor: query ? PINK : "#2A2A2A",
            color: "#F0EDE8",
          }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: "#666" }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Results */}
      <div className="max-h-72 overflow-y-auto space-y-4 pr-1" style={{ scrollbarWidth: "thin" }}>
        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            <p className="font-mono-label text-xs uppercase tracking-widest mb-2" style={{ color: "#555" }}>
              {group}
            </p>
            <div className="flex flex-wrap gap-2">
              {items.map((s) => {
                const sel = value === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => onChange(s.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-semibold transition-all active:scale-95"
                    style={{
                      background: sel ? PINK : "#1E1E1E",
                      borderColor: sel ? PINK : "#2A2A2A",
                      color: sel ? "#0D0D0D" : "#CCC",
                    }}
                  >
                    <span>{s.emoji}</span>
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-center py-6" style={{ color: "#555" }}>
            Ничего не найдено — попробуй другой запрос
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Quiz card ────────────────────────────────────────────────────────────────
function QuizCard({
  step,
  value,
  onChange,
}: {
  step: typeof STEPS[0];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="w-full max-w-lg mx-auto px-5">
      <span
        className="font-mono-label text-xs uppercase tracking-widest inline-block px-3 py-1.5 rounded-full mb-5"
        style={{ background: PINK + "22", color: PINK }}
      >
        {step.tag}
      </span>
      <h2
        className="font-display font-bold leading-tight mb-7"
        style={{ color: "#F0EDE8", fontSize: "clamp(1.1rem, 4vw, 1.6rem)" }}
      >
        {step.q}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {step.opts.map((opt) => {
          const sel = value === opt.v;
          return (
            <button
              key={opt.v}
              onClick={() => onChange(opt.v)}
              className="text-left p-4 rounded-2xl border-2 transition-all duration-200 active:scale-95"
              style={{
                background: sel ? PINK : CARD2,
                borderColor: sel ? PINK : "#2A2A2A",
                color: sel ? DARK : "#F0EDE8",
                transform: sel ? "scale(1.02)" : "scale(1)",
              }}
            >
              <div className="text-2xl mb-2">{opt.emoji}</div>
              <div className="font-display text-xs font-bold leading-tight">{opt.l}</div>
              <div className="text-xs mt-0.5 opacity-70">{opt.s}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tutor card ───────────────────────────────────────────────────────────────
function TutorCard({
  tutor,
  answered,
}: {
  tutor: Tutor & { match: number };
  answered: boolean;
}) {
  const [open, setOpen] = useState(false);
  const matchColor =
    tutor.match >= 80 ? PINK : tutor.match >= 50 ? YELLOW : "#666";

  return (
    <div
      className="rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer"
      style={{
        background: CARD_BG,
        borderColor: open ? tutor.color + "66" : "#2A2A2A",
      }}
      onClick={() => setOpen(!open)}
    >
      {/* Match bar */}
      {answered && (
        <div className="h-1 w-full" style={{ background: "#1E1E1E" }}>
          <div
            className="h-full transition-all duration-700"
            style={{ width: `${tutor.match}%`, background: matchColor }}
          />
        </div>
      )}

      <div className="p-4 sm:p-5 flex gap-4 items-start">
        {/* Photo */}
        <div className="relative shrink-0">
          <div
            className="w-14 h-14 rounded-2xl overflow-hidden"
            style={{ background: tutor.color + "33" }}
          >
            <img
              src={tutor.photo}
              alt={tutor.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <span className="absolute -bottom-1 -right-1 text-base">
            {tutor.emoji}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p
                className="font-display text-sm font-bold"
                style={{ color: "#F0EDE8" }}
              >
                {tutor.name}
              </p>
              <p className="text-xs" style={{ color: "#666" }}>
                {tutor.subject}
              </p>
            </div>
            {answered && (
              <span
                className="font-mono-label text-xs font-bold shrink-0 px-2 py-0.5 rounded-full"
                style={{ background: matchColor + "22", color: matchColor }}
              >
                {tutor.match}%
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
            <span className="text-xs" style={{ color: YELLOW }}>
              ★ {tutor.rating}
            </span>
            <span className="text-xs" style={{ color: "#666" }}>
              {tutor.sessions} занятий
            </span>
            <span
              className="font-mono-label text-xs font-bold"
              style={{ color: "#F0EDE8" }}
            >
              {tutor.price}/ч
            </span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="px-4 sm:px-5 pb-4 flex flex-wrap gap-1.5">
        {tutor.tags.map((t) => (
          <span
            key={t}
            className="text-xs px-2.5 py-0.5 rounded-full"
            style={{ background: "#242424", color: "#999" }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Expand hint */}
      <div className="px-4 sm:px-5 pb-3">
        <span className="text-xs" style={{ color: "#444" }}>
          {open ? "▲ свернуть" : "▼ подробнее"}
        </span>
      </div>

      {/* Expanded */}
      {open && (
        <div
          className="px-4 sm:px-5 pb-5 border-t pt-4"
          style={{ borderColor: "#2A2A2A" }}
        >
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "#AAA" }}
          >
            {tutor.bio}
          </p>
          <a
            href={`https://t.me/${tutor.telegram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-display text-sm font-bold transition-all active:scale-95"
            style={{ background: tutor.color, color: DARK }}
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.4l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.159z" />
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
  const [step, setStep] = useState(-1); // -1 = subject step
  const [selectedSubject, setSelectedSubject] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"all" | "top">("all");
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      setHeaderVisible(y < lastY || y < 60);
      setLastY(y);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [lastY]);

  const currentStep = STEPS[step];
  const currentAnswer = answers[currentStep?.id] ?? "";
  const answered = Object.keys(answers).length === STEPS.length;
  // step -1 = subject, steps 0..4 = quiz; total = 6 steps
  const progress = step === -1 ? 0 : ((step + 1) / STEPS.length) * 100;

  const subjectLabel = SUBJECTS.find((s) => s.id === selectedSubject)?.label ?? "";

  const tutorsWithMatch = TUTORS
    .filter((t) => !selectedSubject || t.subjectIds.includes(selectedSubject))
    .map((t) => ({ ...t, match: calcMatch(t, answers) }))
    .sort((a, b) => b.match - a.match);

  const displayed =
    filter === "top"
      ? tutorsWithMatch.filter((t) => t.match >= 60)
      : tutorsWithMatch;

  function startQuiz() {
    setAnswers({});
    setSelectedSubject("");
    setStep(-1);
    setScreen("quiz");
    window.scrollTo(0, 0);
  }

  // ── HOME ────────────────────────────────────────────────────────────────────
  if (screen === "home") {
    return (
      <div style={{ background: DARK, minHeight: "100%", color: "#F0EDE8" }}>
        {/* Nav */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 py-4 transition-transform duration-300"
          style={{
            background: DARK + "EE",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #1E1E1E",
            transform: headerVisible ? "translateY(0)" : "translateY(-100%)",
          }}
        >
          <span
            className="font-display text-base font-black tracking-tight"
            style={{ color: PINK }}
          >
            катарсис
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setScreen("results")}
              className="hidden sm:block font-display text-xs font-bold px-4 py-2 rounded-full border transition-all active:scale-95"
              style={{ borderColor: "#2A2A2A", color: "#888" }}
            >
              Все репетиторы
            </button>
            <button
              onClick={startQuiz}
              className="font-display text-xs font-bold px-4 py-2.5 rounded-full transition-all active:scale-95"
              style={{ background: PINK, color: DARK }}
            >
              Найти репетитора
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-24 sm:pt-28 pb-12 sm:pb-16 px-5 sm:px-8 lg:px-12 relative overflow-hidden">
          {/* bg blobs */}
          <div
            className="absolute top-10 right-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full opacity-10 pointer-events-none"
            style={{ background: PINK, filter: "blur(80px)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-48 sm:w-72 h-48 sm:h-72 rounded-full opacity-10 pointer-events-none"
            style={{ background: YELLOW, filter: "blur(80px)" }}
          />

          <div className="max-w-4xl mx-auto relative">
            {/* Floating stickers — desktop only */}
            <div className="float absolute -right-4 top-8 hidden lg:block">
              <div
                className="w-16 h-16 rounded-2xl rotate-12 flex items-center justify-center text-2xl shadow-xl"
                style={{ background: YELLOW, color: DARK }}
              >
                ✨
              </div>
            </div>
            <div className="float-reverse absolute right-24 top-40 hidden lg:block">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-xl border-2"
                style={{ background: DARK, borderColor: PINK, color: PINK }}
              >
                ♥
              </div>
            </div>

            <div
              className="font-mono-label text-xs uppercase tracking-widest inline-block px-3 py-1.5 rounded-full mb-5"
              style={{ background: PINK + "22", color: PINK }}
            >
              подбор репетитора по вайбу
            </div>

            <h1
              className="font-display font-black leading-[0.95] mb-5 tracking-tight"
              style={{ fontSize: "clamp(2rem, 7vw, 4.5rem)", color: "#F0EDE8" }}
            >
              найти репетитора,{" "}
              <span
                className="relative inline-block"
                style={{
                  WebkitTextStroke: `2px ${PINK}`,
                  color: "transparent",
                }}
              >
                с которым
              </span>
              <br />
              <span style={{ color: YELLOW }}>кайфово учиться</span>
            </h1>

            <p
              className="leading-relaxed max-w-md mb-8"
              style={{ color: "#888", fontSize: "clamp(0.85rem, 2vw, 1.05rem)" }}
            >
              Найти хорошего репетитора сложно. Найти психологически
              совместимого — ещё сложнее.{" "}
              <span style={{ color: "#F0EDE8" }}>
                Мы сделали это за 5 минут.
              </span>
            </p>

            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={startQuiz}
                className="pulse-btn font-display font-bold text-sm px-7 py-4 rounded-2xl transition-all active:scale-95"
                style={{ background: PINK, color: DARK }}
              >
                Пройти тест →
              </button>
              <button
                onClick={() => setScreen("results")}
                className="font-display font-bold text-sm px-7 py-4 rounded-2xl border-2 transition-all active:scale-95"
                style={{ borderColor: "#2A2A2A", color: "#888" }}
              >
                Смотреть всех
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 sm:gap-10 mt-12">
              {[
                ["топ", "преподаватели"],
                ["90%", "из МГУ"],
                ["5 мин", "на подбор"],
              ].map(([n, l]) => (
                <div key={l}>
                  <p
                    className="font-display text-lg sm:text-xl font-black"
                    style={{ color: YELLOW }}
                  >
                    {n}
                  </p>
                  <p className="text-xs" style={{ color: "#555" }}>
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Marquee />

        {/* Problem vs Solution */}
        <section className="px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Pain */}
              <div
                className="rounded-3xl p-6 sm:p-8 border"
                style={{ background: CARD_BG, borderColor: "#2A2A2A" }}
              >
                <div className="text-4xl mb-4">😵‍💫</div>
                <h3
                  className="font-display text-lg sm:text-xl font-bold mb-3"
                  style={{ color: "#F0EDE8" }}
                >
                  Как выбирают обычно
                </h3>
                <ul className="space-y-2">
                  {[
                    "Смотришь рейтинг — непонятно",
                    "Читаешь описание — одинаковое у всех",
                    "Пробуешь — не заходит",
                    "Ищёшь снова...",
                  ].map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: "#666" }}
                    >
                      <span style={{ color: "#444" }}>✕</span> {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solution */}
              <div
                className="rounded-3xl p-6 sm:p-8 border"
                style={{ background: PINK + "15", borderColor: PINK + "44" }}
              >
                <div className="text-4xl mb-4">✨</div>
                <h3
                  className="font-display text-lg sm:text-xl font-bold mb-3"
                  style={{ color: "#F0EDE8" }}
                >
                  Как у нас
                </h3>
                <ul className="space-y-2">
                  {[
                    "Отвечаешь на 5 вопросов о себе",
                    "Алгоритм ищет совместимость",
                    "Видишь % совпадения психопрофиля",
                    "Первое занятие — и ты уже знаешь",
                  ].map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: "#C8C8C8" }}
                    >
                      <span style={{ color: PINK }}>✓</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="px-5 sm:px-8 lg:px-12 py-4 pb-16 sm:pb-20">
          <div className="max-w-4xl mx-auto">
            <p
              className="font-mono-label text-xs uppercase tracking-widest mb-2"
              style={{ color: "#555" }}
            >
              как работает
            </p>
            <h2
              className="font-display font-black mb-8 sm:mb-10"
              style={{
                fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
                color: "#F0EDE8",
              }}
            >
              три шага до{" "}
              <span style={{ color: PINK }}>своего</span>
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  n: "01",
                  emoji: "🧠",
                  title: "Тест",
                  desc: "5 быстрых вопросов про твой стиль, вайб и цель",
                },
                {
                  n: "02",
                  emoji: "🔮",
                  title: "Подбор",
                  desc: "Алгоритм считает психологическую совместимость",
                },
                {
                  n: "03",
                  emoji: "🚀",
                  title: "Поехали",
                  desc: "Пробное занятие — и ты чувствуешь, твоё или нет",
                },
              ].map((s, i) => (
                <div
                  key={s.n}
                  className="rounded-3xl p-6 border relative overflow-hidden"
                  style={{ background: CARD_BG, borderColor: "#2A2A2A" }}
                >
                  <div
                    className="absolute top-4 right-4 font-display text-4xl font-black opacity-10"
                    style={{ color: i % 2 === 0 ? PINK : YELLOW }}
                  >
                    {s.n}
                  </div>
                  <div className="text-3xl mb-3">{s.emoji}</div>
                  <p
                    className="font-display text-base font-bold mb-1"
                    style={{ color: "#F0EDE8" }}
                  >
                    {s.title}
                  </p>
                  <p className="text-sm" style={{ color: "#666" }}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 sm:px-8 lg:px-12 pb-16 sm:pb-20">
          <div
            className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 md:p-14 text-center relative overflow-hidden"
            style={{ background: PINK }}
          >
            <div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
              style={{ background: DARK }}
            />
            <h2
              className="font-display font-black leading-tight mb-4 relative z-10"
              style={{
                fontSize: "clamp(1.6rem, 5vw, 3rem)",
                color: DARK,
              }}
            >
              готов найти
              <br />
              своего человека?
            </h2>
            <p
              className="text-sm mb-8 relative z-10"
              style={{ color: DARK + "AA" }}
            >
              5 вопросов · бесплатно · никаких регистраций
            </p>
            <button
              onClick={startQuiz}
              className="relative z-10 font-display font-black text-sm px-10 py-4 rounded-2xl transition-all active:scale-95"
              style={{ background: DARK, color: PINK }}
            >
              Начать тест →
            </button>
          </div>
        </section>

        <footer
          className="px-5 sm:px-8 py-6 border-t text-center"
          style={{ borderColor: "#1E1E1E" }}
        >
          <span
            className="font-display text-xs font-black"
            style={{ color: PINK }}
          >
            катарсис
          </span>
          <span className="text-xs ml-4" style={{ color: "#444" }}>
            © 2026
          </span>
        </footer>
      </div>
    );
  }

  // ── QUIZ ────────────────────────────────────────────────────────────────────
  if (screen === "quiz") {
    return (
      <div
        className="min-h-full flex flex-col"
        style={{ background: DARK }}
      >
        {/* Top bar */}
        <div
          className="px-5 py-4 flex items-center justify-between border-b"
          style={{ borderColor: "#1E1E1E" }}
        >
          <button
            onClick={() => setScreen("home")}
            className="font-display text-sm font-black"
            style={{ color: PINK }}
          >
            катарсис
          </button>
          <span
            className="font-mono-label text-xs"
            style={{ color: "#555" }}
          >
            {step === -1 ? "предмет" : `${step + 1} / ${STEPS.length}`}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1" style={{ background: "#1E1E1E" }}>
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${PINK}, ${YELLOW})`,
            }}
          />
        </div>

        {/* Step dots — subject + 5 quiz steps */}
        <div className="flex gap-2 justify-center pt-6">
          {/* subject dot */}
          <div
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: step === -1 ? "28px" : "8px",
              background: step >= 0 ? PINK : YELLOW,
            }}
          />
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === step ? "28px" : "8px",
                background: i < step ? PINK : i === step ? YELLOW : "#2A2A2A",
              }}
            />
          ))}
        </div>

        {/* Card */}
        <div className="flex-1 flex items-center py-8">
          {step === -1 ? (
            <SubjectStep
              value={selectedSubject}
              onChange={setSelectedSubject}
            />
          ) : (
            <QuizCard
              step={currentStep}
              value={currentAnswer}
              onChange={(v) =>
                setAnswers((a) => ({ ...a, [currentStep.id]: v }))
              }
            />
          )}
        </div>

        {/* Buttons */}
        <div className="px-5 pb-8 sm:pb-10 flex gap-3 max-w-lg mx-auto w-full">
          <button
            onClick={() => {
              if (step === -1) setScreen("home");
              else if (step === 0) setStep(-1);
              else setStep((s) => s - 1);
            }}
            className="flex-1 py-3.5 rounded-2xl font-display text-sm font-bold border transition-all active:scale-95"
            style={{ borderColor: "#2A2A2A", color: "#666" }}
          >
            ←
          </button>
          <button
            onClick={() => {
              if (step === -1) {
                setStep(0);
              } else if (!currentAnswer) {
                return;
              } else if (step < STEPS.length - 1) {
                setStep((s) => s + 1);
              } else {
                setScreen("results");
              }
            }}
            disabled={step >= 0 && !currentAnswer}
            className="flex-[3] py-3.5 rounded-2xl font-display text-sm font-bold transition-all active:scale-95 disabled:opacity-30"
            style={{
              background: step === -1 || currentAnswer ? PINK : "#2A2A2A",
              color: step === -1 || currentAnswer ? DARK : "#555",
            }}
          >
            {step === -1
              ? selectedSubject
                ? `${SUBJECTS.find(s => s.id === selectedSubject)?.emoji} Дальше →`
                : "Пропустить →"
              : step === STEPS.length - 1
              ? "Показать результат →"
              : "Дальше →"}
          </button>
        </div>
      </div>
    );
  }

  // ── RESULTS ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: DARK, minHeight: "100%", color: "#F0EDE8" }}>
      <nav
        className="flex items-center justify-between px-5 sm:px-8 py-4 border-b sticky top-0 z-40"
        style={{
          background: DARK + "EE",
          backdropFilter: "blur(12px)",
          borderColor: "#1E1E1E",
        }}
      >
        <button
          onClick={() => setScreen("home")}
          className="font-display text-sm font-black"
          style={{ color: PINK }}
        >
          катарсис
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setScreen("home")}
            className="hidden sm:block font-mono-label text-xs px-4 py-2 rounded-full border transition-all active:scale-95"
            style={{ borderColor: "#2A2A2A", color: "#666" }}
          >
            ← на главную
          </button>
          <button
            onClick={startQuiz}
            className="font-mono-label text-xs px-4 py-2 rounded-full border transition-all active:scale-95"
            style={{ borderColor: "#2A2A2A", color: "#888" }}
          >
            ↺ заново
          </button>
        </div>
      </nav>

      <div className="px-5 sm:px-8 lg:px-12 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          {answered ? (
            <>
              <div className="flex flex-wrap gap-2 mb-3">
                <div
                  className="font-mono-label text-xs uppercase tracking-widest inline-block px-3 py-1 rounded-full"
                  style={{ background: PINK + "22", color: PINK }}
                >
                  твой профиль готов
                </div>
                {subjectLabel && (
                  <div
                    className="font-mono-label text-xs uppercase tracking-widest inline-flex items-center gap-1 px-3 py-1 rounded-full"
                    style={{ background: YELLOW + "22", color: YELLOW }}
                  >
                    {SUBJECTS.find(s => s.id === selectedSubject)?.emoji} {subjectLabel}
                  </div>
                )}
              </div>
              <h1
                className="font-display font-black"
                style={{ fontSize: "clamp(1.4rem, 4vw, 2.2rem)", color: "#F0EDE8" }}
              >
                вот твои репетиторы 🎯
              </h1>
            </>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-3 items-center">
                <h1
                  className="font-display font-black"
                  style={{ fontSize: "clamp(1.4rem, 4vw, 2.2rem)", color: "#F0EDE8" }}
                >
                  {subjectLabel ? subjectLabel : "Все репетиторы"}
                </h1>
                {subjectLabel && (
                  <span className="text-2xl">{SUBJECTS.find(s => s.id === selectedSubject)?.emoji}</span>
                )}
              </div>
              <p className="text-sm" style={{ color: "#666" }}>
                <button
                  onClick={startQuiz}
                  style={{ color: PINK }}
                  className="underline underline-offset-2"
                >
                  пройди тест
                </button>{" "}
                чтобы увидеть совместимость
              </p>
            </>
          )}
        </div>

        {/* Profile recap tags */}
        {answered && (
          <div
            className="mb-6 p-4 rounded-2xl flex flex-wrap gap-2 border"
            style={{ background: CARD_BG, borderColor: "#2A2A2A" }}
          >
            {STEPS.map((s) => {
              const opt = s.opts.find((o) => o.v === answers[s.id]);
              return opt ? (
                <span
                  key={s.id}
                  className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full"
                  style={{ background: "#242424", color: "#CCC" }}
                >
                  {opt.emoji} {opt.l}
                </span>
              ) : null;
            })}
          </div>
        )}

        {/* Filter */}
        {answered && (
          <div className="flex flex-wrap gap-2 mb-6">
            {(
              [
                ["all", "Все"],
                ["top", "60%+ совпадение"],
              ] as const
            ).map(([v, l]) => (
              <button
                key={v}
                onClick={() => setFilter(v)}
                className="font-display text-xs font-bold px-4 py-2 rounded-full border transition-all"
                style={
                  filter === v
                    ? {
                        background: PINK,
                        color: DARK,
                        borderColor: PINK,
                      }
                    : {
                        background: "transparent",
                        color: "#666",
                        borderColor: "#2A2A2A",
                      }
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
          <div>
            {/* Sorry block */}
            <div
              className="rounded-3xl p-7 sm:p-10 mb-8 text-center border"
              style={{ background: CARD_BG, borderColor: "#2A2A2A" }}
            >
              <div className="text-5xl mb-4">😔</div>
              <h2
                className="font-display font-bold mb-2"
                style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)", color: "#F0EDE8" }}
              >
                Идеального совпадения не нашлось
              </h2>
              <p className="text-sm mb-6" style={{ color: "#666" }}>
                Но это не значит, что тебе некому помочь — посмотри всех наших репетиторов,
                среди них точно найдётся твой человек 💛
              </p>
              <button
                onClick={() => setFilter("all")}
                className="font-display text-sm font-bold px-7 py-3.5 rounded-2xl border-2 transition-all active:scale-95"
                style={{ background: PINK, color: DARK, borderColor: PINK }}
              >
                Показать всех репетиторов →
              </button>
            </div>

            {/* All tutors fallback */}
            <p className="font-mono-label text-xs uppercase tracking-widest mb-4" style={{ color: "#555" }}>
              все репетиторы
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tutorsWithMatch.map((t) => (
                <TutorCard key={t.id} tutor={t} answered={answered} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
