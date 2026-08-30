import { useState, useEffect } from "react";

// ─── palette ─────────────────────────────────────────────────────────────────
const PINK = "#F4BFC9";
const YELLOW = "#FFD47A";
const DARK = "#0D0D0D";
const CARD_BG = "#161616";
const CARD2 = "#1E1E1E";

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
      { v: "text", emoji: "📖", l: "Текстом", s: "читаю и конспекчу" },
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

// ─── tutors ───────────────────────────────────────────────────────────────────
const TUTORS = [
  {
    id: 1,
    name: "Маша С.",
    subject: "Математика",
    emoji: "🧮",
    photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop&auto=format",
    price: "2 400 ₽",
    rating: 4.9,
    sessions: 312,
    tags: ["Картинками", "Вдумчиво", "Чилл", "На примере"],
    profiles: { vibe: "chill", style: "visual", pace: "slow", feedback: "example", goal: "interest" },
    bio: "Объясняю через мемы и схемы. Никаких скучных формул без смысла.",
    color: PINK,
    telegram: "masha_math_tutor",
  },
  {
    id: 2,
    name: "Лёша В.",
    subject: "Программирование",
    emoji: "💻",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format",
    price: "2 800 ₽",
    rating: 4.8,
    sessions: 227,
    tags: ["Практикой", "Газ в пол", "Фокус", "Честно"],
    profiles: { vibe: "focus", style: "hands", pace: "fast", feedback: "honest", goal: "career" },
    bio: "С первого занятия пишем код. Реальные проекты, реальный результат.",
    color: YELLOW,
    telegram: "alexey_code",
  },
  {
    id: 3,
    name: "Лена К.",
    subject: "Русский / Лит-ра",
    emoji: "📚",
    photo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=300&fit=crop&auto=format",
    price: "2 200 ₽",
    rating: 5.0,
    sessions: 498,
    tags: ["Разговором", "Умеренно", "Творчество", "Мягко"],
    profiles: { vibe: "creative", style: "talk", pace: "mid", feedback: "soft", goal: "interest" },
    bio: "Учу слышать язык. Обсуждаем, спорим, находим свои слова.",
    color: PINK,
    telegram: "lena_russian_lit",
  },
  {
    id: 4,
    name: "Дима П.",
    subject: "История",
    emoji: "🏛️",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&auto=format",
    price: "1 900 ₽",
    rating: 4.7,
    sessions: 281,
    tags: ["Текстом", "По волне", "Чилл", "Письменно"],
    profiles: { vibe: "chill", style: "text", pace: "wave", feedback: "written", goal: "exam" },
    bio: "История — это детектив. Ищём улики, строим свою версию событий.",
    color: YELLOW,
    telegram: "dima_history",
  },
  {
    id: 5,
    name: "Аня Б.",
    subject: "Английский",
    emoji: "🌍",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&auto=format",
    price: "2 600 ₽",
    rating: 4.9,
    sessions: 376,
    tags: ["Картинками", "Умеренно", "Энергия", "Мягко"],
    profiles: { vibe: "hype", style: "visual", pace: "mid", feedback: "soft", goal: "career" },
    bio: "Говорим с первого урока. Ошибаться не страшно — это часть игры.",
    color: PINK,
    telegram: "anya_english_talks",
  },
  {
    id: 6,
    name: "Игорь Л.",
    subject: "Химия / Биология",
    emoji: "🔬",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&auto=format",
    price: "2 100 ₽",
    rating: 4.6,
    sessions: 154,
    tags: ["Практикой", "Умеренно", "Фокус", "Честно"],
    profiles: { vibe: "focus", style: "hands", pace: "mid", feedback: "honest", goal: "exam" },
    bio: "Наука = опыты + аналогии из жизни. Сухая теория — не моё.",
    color: YELLOW,
    telegram: "igor_science_lab",
  },
];

function calcMatch(tutor: typeof TUTORS[0], answers: Record<string, string>) {
  const keys = Object.keys(answers);
  if (!keys.length) return 0;
  let score = 0;
  keys.forEach((k) => {
    if (tutor.profiles[k as keyof typeof tutor.profiles] === answers[k]) score++;
  });
  return Math.round((score / STEPS.length) * 100);
}

// ─── Marquee ──────────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = ["найди своего", "подбор за 5 минут", "психологически совместимый", "для зумеров", "репетитор = вайб"];

function Marquee() {
  return (
    <div className="overflow-hidden border-y py-3" style={{ borderColor: "#2A2A2A" }}>
      <div className="flex whitespace-nowrap marquee-track" style={{ width: "200%" }}>
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span key={i} className="font-display text-xs uppercase tracking-widest mx-6" style={{ color: i % 4 === 0 ? PINK : i % 4 === 2 ? YELLOW : "#444" }}>
            {item} ★
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Quiz card ────────────────────────────────────────────────────────────────
function QuizCard({
  step, value, onChange,
}: {
  step: typeof STEPS[0]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <span
        className="font-mono-label text-xs tracking-widest px-3 py-1 rounded-full mb-4 inline-block"
        style={{ background: PINK + "22", color: PINK }}
      >
        {step.tag}
      </span>
      <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-8" style={{ color: "#F0EDE8" }}>
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
              <div className="font-display text-sm font-bold">{opt.l}</div>
              <div className="text-xs mt-0.5 opacity-70">{opt.s}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tutor card ───────────────────────────────────────────────────────────────
function TutorCard({ tutor, answered }: { tutor: typeof TUTORS[0] & { match: number }; answered: boolean }) {
  const [open, setOpen] = useState(false);
  const matchColor = tutor.match >= 80 ? PINK : tutor.match >= 50 ? YELLOW : "#666";

  return (
    <div
      className="rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer group"
      style={{ background: CARD_BG, borderColor: open ? tutor.color + "66" : "#2A2A2A" }}
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

      <div className="p-5 flex gap-4 items-start">
        {/* Photo */}
        <div className="relative shrink-0">
          <div
            className="w-14 h-14 rounded-2xl overflow-hidden"
            style={{ background: tutor.color + "33" }}
          >
            <img src={tutor.photo} alt={tutor.name} className="w-full h-full object-cover" />
          </div>
          <span className="absolute -bottom-1 -right-1 text-base">{tutor.emoji}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-display text-sm font-bold" style={{ color: "#F0EDE8" }}>{tutor.name}</p>
              <p className="text-xs" style={{ color: "#666" }}>{tutor.subject}</p>
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

          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs" style={{ color: YELLOW }}>★ {tutor.rating}</span>
            <span className="text-xs" style={{ color: "#666" }}>{tutor.sessions} занятий</span>
            <span className="font-mono-label text-xs font-bold" style={{ color: "#F0EDE8" }}>{tutor.price}/ч</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="px-5 pb-4 flex flex-wrap gap-1.5">
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

      {/* Expanded */}
      {open && (
        <div className="px-5 pb-5 border-t pt-4" style={{ borderColor: "#2A2A2A" }}>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "#AAA" }}>{tutor.bio}</p>
          <a
            href={`https://t.me/${tutor.telegram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-display text-sm font-bold transition-all active:scale-95"
            style={{ background: tutor.color, color: DARK }}
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
      <div style={{ background: DARK, minHeight: "100%", color: "#F0EDE8" }}>
        {/* Nav */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-transform duration-300"
          style={{
            background: DARK + "EE",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #1E1E1E",
            transform: headerVisible ? "translateY(0)" : "translateY(-100%)",
          }}
        >
          <span className="font-display text-base font-black tracking-tight" style={{ color: PINK }}>
            катарсис
          </span>
          <button
            onClick={startQuiz}
            className="font-display text-xs font-bold px-4 py-2 rounded-full transition-all active:scale-95"
            style={{ background: PINK, color: DARK }}
          >
            Найти репетитора
          </button>
        </nav>

        {/* Hero */}
        <section className="pt-28 pb-16 px-6 md:px-12 relative overflow-hidden">
          {/* bg blobs */}
          <div
            className="absolute top-10 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
            style={{ background: PINK, filter: "blur(80px)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
            style={{ background: YELLOW, filter: "blur(80px)" }}
          />

          <div className="max-w-4xl mx-auto relative">
            {/* Floating stickers */}
            <div className="float absolute -right-4 top-8 hidden md:block">
              <div
                className="w-16 h-16 rounded-2xl rotate-12 flex items-center justify-center text-2xl shadow-xl"
                style={{ background: YELLOW, color: DARK }}
              >
                ✨
              </div>
            </div>
            <div className="float-reverse absolute right-24 top-40 hidden md:block">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-xl border-2"
                style={{ background: DARK, borderColor: PINK, color: PINK }}
              >
                ♥
              </div>
            </div>

            <div
              className="font-mono-label text-xs uppercase tracking-widest inline-block px-3 py-1.5 rounded-full mb-6"
              style={{ background: PINK + "22", color: PINK }}
            >
              подбор репетитора по вайбу
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-black leading-[0.95] mb-6 tracking-tight">
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

            <p className="text-base md:text-lg leading-relaxed max-w-md mb-10" style={{ color: "#888" }}>
              Найти хорошего репетитора сложно. Найти психологически совместимого — ещё сложнее.{" "}
              <span style={{ color: "#F0EDE8" }}>Мы сделали это за 5 минут.</span>
            </p>

            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={startQuiz}
                className="pulse-btn font-display font-bold text-sm px-8 py-4 rounded-2xl transition-all active:scale-95"
                style={{ background: PINK, color: DARK }}
              >
                Пройти тест →
              </button>
              <button
                onClick={() => setScreen("results")}
                className="font-display font-bold text-sm px-8 py-4 rounded-2xl border-2 transition-all active:scale-95"
                style={{ borderColor: "#2A2A2A", color: "#888" }}
              >
                Смотреть всех
              </button>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 mt-14">
              {[["240+", "репетиторов"], ["4.8★", "средний рейтинг"], ["5 мин", "на подбор"]].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-xl font-black" style={{ color: YELLOW }}>{n}</p>
                  <p className="text-xs" style={{ color: "#555" }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Marquee />

        {/* Problem section */}
        <section className="px-6 md:px-12 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pain */}
              <div className="rounded-3xl p-8 border" style={{ background: CARD_BG, borderColor: "#2A2A2A" }}>
                <div className="text-4xl mb-4">😵‍💫</div>
                <h3 className="font-display text-xl font-bold mb-3" style={{ color: "#F0EDE8" }}>
                  Как выбирают обычно
                </h3>
                <ul className="space-y-2">
                  {["Смотришь рейтинг — непонятно", "Читаешь описание — одинаковое у всех", "Пробуешь — не заходит", "Ищёшь снова..."].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm" style={{ color: "#666" }}>
                      <span style={{ color: "#444" }}>✕</span> {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solution */}
              <div
                className="rounded-3xl p-8 border"
                style={{ background: PINK + "15", borderColor: PINK + "44" }}
              >
                <div className="text-4xl mb-4">✨</div>
                <h3 className="font-display text-xl font-bold mb-3" style={{ color: "#F0EDE8" }}>
                  Как у нас
                </h3>
                <ul className="space-y-2">
                  {["Отвечаешь на 5 вопросов о себе", "Алгоритм ищет совместимость", "Видишь % совпадения психопрофиля", "Первое занятие — и ты уже знаешь"].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm" style={{ color: "#C8C8C8" }}>
                      <span style={{ color: PINK }}>✓</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="px-6 md:px-12 py-10 pb-20">
          <div className="max-w-4xl mx-auto">
            <p className="font-mono-label text-xs uppercase tracking-widest mb-2" style={{ color: "#555" }}>как работает</p>
            <h2 className="font-display text-3xl md:text-4xl font-black mb-10" style={{ color: "#F0EDE8" }}>
              три шага до <span style={{ color: PINK }}>своего</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { n: "01", emoji: "🧠", title: "Тест", desc: "5 быстрых вопросов про твой стиль, вайб и цель" },
                { n: "02", emoji: "🔮", title: "Подбор", desc: "Алгоритм считает психологическую совместимость" },
                { n: "03", emoji: "🚀", title: "Поехали", desc: "Пробное занятие — и ты чувствуешь, твоё или нет" },
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
                  <p className="font-display text-lg font-bold mb-1" style={{ color: "#F0EDE8" }}>{s.title}</p>
                  <p className="text-sm" style={{ color: "#666" }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-12 pb-20">
          <div
            className="max-w-4xl mx-auto rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
            style={{ background: PINK }}
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20" style={{ background: DARK }} />
            <h2 className="font-display text-3xl md:text-5xl font-black leading-tight mb-4" style={{ color: DARK }}>
              готов найти<br />своего человека?
            </h2>
            <p className="text-sm mb-8" style={{ color: DARK + "AA" }}>
              5 вопросов · бесплатно · никаких регистраций
            </p>
            <button
              onClick={startQuiz}
              className="font-display font-black text-sm px-10 py-4 rounded-2xl transition-all active:scale-95"
              style={{ background: DARK, color: PINK }}
            >
              Начать тест →
            </button>
          </div>
        </section>

        <footer className="px-6 md:px-12 py-6 border-t text-center" style={{ borderColor: "#1E1E1E" }}>
          <span className="font-display text-xs font-black" style={{ color: PINK }}>катарсис</span>
          <span className="text-xs ml-4" style={{ color: "#444" }}>© 2026</span>
        </footer>
      </div>
    );
  }

  // ── QUIZ ────────────────────────────────────────────────────────────────────
  if (screen === "quiz") {
    return (
      <div className="min-h-full flex flex-col" style={{ background: DARK }}>
        {/* Top bar */}
        <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: "#1E1E1E" }}>
          <button
            onClick={() => setScreen("home")}
            className="font-display text-sm font-black"
            style={{ color: PINK }}
          >
            катарсис
          </button>
          <span className="font-mono-label text-xs" style={{ color: "#555" }}>
            {step + 1} / {STEPS.length}
          </span>
        </div>

        {/* Progress */}
        <div className="h-1" style={{ background: "#1E1E1E" }}>
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${PINK}, ${YELLOW})` }}
          />
        </div>

        {/* Step dots */}
        <div className="flex gap-2 justify-center pt-6">
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
        <div className="flex-1 flex items-center py-10">
          <QuizCard
            step={currentStep}
            value={currentAnswer}
            onChange={(v) => setAnswers((a) => ({ ...a, [currentStep.id]: v }))}
          />
        </div>

        {/* Buttons */}
        <div className="px-6 pb-10 flex gap-3 max-w-lg mx-auto w-full">
          <button
            onClick={() => (step > 0 ? setStep((s) => s - 1) : setScreen("home"))}
            className="flex-1 py-3.5 rounded-2xl font-display text-sm font-bold border transition-all active:scale-95"
            style={{ borderColor: "#2A2A2A", color: "#666" }}
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
            className="flex-[3] py-3.5 rounded-2xl font-display text-sm font-bold transition-all active:scale-95 disabled:opacity-30"
            style={{ background: currentAnswer ? PINK : "#2A2A2A", color: currentAnswer ? DARK : "#555" }}
          >
            {step === STEPS.length - 1 ? "Показать результат →" : "Дальше →"}
          </button>
        </div>
      </div>
    );
  }

  // ── RESULTS ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: DARK, minHeight: "100%", color: "#F0EDE8" }}>
      <nav className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-40" style={{ background: DARK + "EE", backdropFilter: "blur(12px)", borderColor: "#1E1E1E" }}>
        <button onClick={() => setScreen("home")} className="font-display text-sm font-black" style={{ color: PINK }}>
          катарсис
        </button>
        <button
          onClick={startQuiz}
          className="font-mono-label text-xs px-4 py-2 rounded-full border transition-all active:scale-95"
          style={{ borderColor: "#2A2A2A", color: "#888" }}
        >
          ↺ заново
        </button>
      </nav>

      <div className="px-6 md:px-12 py-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          {answered ? (
            <>
              <div
                className="font-mono-label text-xs uppercase tracking-widest inline-block px-3 py-1 rounded-full mb-3"
                style={{ background: PINK + "22", color: PINK }}
              >
                твой профиль готов
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-black" style={{ color: "#F0EDE8" }}>
                вот твои репетиторы 🎯
              </h1>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl font-black mb-2">все репетиторы</h1>
              <p className="text-sm" style={{ color: "#666" }}>
                <button onClick={startQuiz} style={{ color: PINK }} className="underline underline-offset-2">пройди тест</button>
                {" "}чтобы увидеть совместимость
              </p>
            </>
          )}
        </div>

        {/* Profile recap */}
        {answered && (
          <div
            className="mb-6 p-4 rounded-2xl flex flex-wrap gap-3 border"
            style={{ background: CARD_BG, borderColor: "#2A2A2A" }}
          >
            {STEPS.map((s) => {
              const opt = s.opts.find((o) => o.v === answers[s.id]);
              return opt ? (
                <span key={s.id} className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full" style={{ background: "#242424", color: "#CCC" }}>
                  {opt.emoji} {opt.l}
                </span>
              ) : null;
            })}
          </div>
        )}

        {/* Filter */}
        {answered && (
          <div className="flex gap-2 mb-6">
            {([["all", "Все"], ["top", "60%+ совпадение"]] as const).map(([v, l]) => (
              <button
                key={v}
                onClick={() => setFilter(v)}
                className="font-display text-xs font-bold px-4 py-2 rounded-full border transition-all"
                style={filter === v ? { background: PINK, color: DARK, borderColor: PINK } : { background: "transparent", color: "#666", borderColor: "#2A2A2A" }}
              >
                {l}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((t) => (
            <TutorCard key={t.id} tutor={t} answered={answered} />
          ))}
        </div>
      </div>
    </div>
  );
}
