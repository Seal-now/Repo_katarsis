export const PINK = "#F4BFC9";
export const YELLOW = "#FFD47A";
export const MINT = "#B8F5D0";
export const LAVENDER = "#D4C5F9";

export interface Tutor {
  id: number;
  name: string;
  subject: string;
  emoji: string;
  photo: string;
  price: string;
  rating: number;
  sessions: number;
  tags: string[];
  profiles: {
    vibe: string;
    style: string;
    pace: string;
    feedback: string;
    goal: string;
  };
  bio: string;
  color: string;
  telegram: string;
}

export const TUTORS: Tutor[] = [
  {
    id: 1,
    name: "Маша С.",
    subject: "Математика",
    emoji: "🧮",
    photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&auto=format",
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
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format",
    price: "2 800 ₽",
    rating: 4.8,
    sessions: 227,
    tags: ["Практикой", "Газ в пол", "Фокус", "Честно"],
    profiles: { vibe: "focus", style: "hands", pace: "fast", feedback: "honest", goal: "career" },
    bio: "С первого занятия пишем код. Реальные проекты, реальный результат.",
    color: YELLOW,
    telegram: "lyosha_code",
  },
  {
    id: 3,
    name: "Лена К.",
    subject: "Русский / Лит-ра",
    emoji: "📚",
    photo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&auto=format",
    price: "2 200 ₽",
    rating: 5.0,
    sessions: 498,
    tags: ["Разговором", "Умеренно", "Творчество", "Мягко"],
    profiles: { vibe: "creative", style: "talk", pace: "mid", feedback: "soft", goal: "interest" },
    bio: "Учу слышать язык. Обсуждаем, спорим, находим свои слова.",
    color: MINT,
    telegram: "lena_ruslitru",
  },
  {
    id: 4,
    name: "Дима П.",
    subject: "История",
    emoji: "🏛️",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format",
    price: "1 900 ₽",
    rating: 4.7,
    sessions: 281,
    tags: ["Текстом", "По волне", "Чилл", "Письменно"],
    profiles: { vibe: "chill", style: "text", pace: "wave", feedback: "written", goal: "exam" },
    bio: "История — это детектив. Ищём улики, строим свою версию событий.",
    color: LAVENDER,
    telegram: "dima_history",
  },
  {
    id: 5,
    name: "Аня Б.",
    subject: "Английский",
    emoji: "🌍",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&auto=format",
    price: "2 600 ₽",
    rating: 4.9,
    sessions: 376,
    tags: ["Картинками", "Умеренно", "Энергия", "Мягко"],
    profiles: { vibe: "hype", style: "visual", pace: "mid", feedback: "soft", goal: "career" },
    bio: "Говорим с первого урока. Ошибаться не страшно — это часть игры.",
    color: YELLOW,
    telegram: "anya_english",
  },
  {
    id: 6,
    name: "Игорь Л.",
    subject: "Химия / Биология",
    emoji: "🔬",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format",
    price: "2 100 ₽",
    rating: 4.6,
    sessions: 154,
    tags: ["Практикой", "Умеренно", "Фокус", "Честно"],
    profiles: { vibe: "focus", style: "hands", pace: "mid", feedback: "honest", goal: "exam" },
    bio: "Наука = опыты + аналогии из жизни. Сухая теория — не моё.",
    color: MINT,
    telegram: "igor_science",
  },
];

export function calcMatch(tutor: Tutor, answers: Record<string, string>): number {
  const keys = ["vibe", "style", "pace", "feedback", "goal"] as const;
  let score = 0;
  keys.forEach((k) => {
    if (answers[k] && tutor.profiles[k] === answers[k]) score++;
  });
  return Math.round((score / 5) * 100);
}
