const db = require("./database");

const tutors = [
  {
    name: "Маша С.",
    subject: "Математика",
    emoji: "🧮",
    photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop&auto=format",
    price: "2 400 ₽",
    rating: 4.9,
    sessions: 312,
    bio: "Объясняю через мемы и схемы. Никаких скучных формул без смысла.",
    color: "#F4BFC9",
    vibe: "chill",
    style: "visual",
    pace: "slow",
    feedback: "example",
    goal: "interest",
    tags: "Картинками,Вдумчиво,Чилл,На примере",
  },
  {
    name: "Лёша В.",
    subject: "Программирование",
    emoji: "💻",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format",
    price: "2 800 ₽",
    rating: 4.8,
    sessions: 227,
    bio: "С первого занятия пишем код. Реальные проекты, реальный результат.",
    color: "#FFD47A",
    vibe: "focus",
    style: "hands",
    pace: "fast",
    feedback: "honest",
    goal: "career",
    tags: "Практикой,Газ в пол,Фокус,Честно",
  },
  {
    name: "Лена К.",
    subject: "Русский / Лит-ра",
    emoji: "📚",
    photo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=300&fit=crop&auto=format",
    price: "2 200 ₽",
    rating: 5.0,
    sessions: 498,
    bio: "Учу слышать язык. Обсуждаем, спорим, находим свои слова.",
    color: "#F4BFC9",
    vibe: "creative",
    style: "talk",
    pace: "mid",
    feedback: "soft",
    goal: "interest",
    tags: "Разговором,Умеренно,Творчество,Мягко",
  },
  {
    name: "Дима П.",
    subject: "История",
    emoji: "🏛️",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&auto=format",
    price: "1 900 ₽",
    rating: 4.7,
    sessions: 281,
    bio: "История — это детектив. Ищём улики, строим свою версию событий.",
    color: "#FFD47A",
    vibe: "chill",
    style: "text",
    pace: "wave",
    feedback: "written",
    goal: "exam",
    tags: "Текстом,По волне,Чилл,Письменно",
  },
  {
    name: "Аня Б.",
    subject: "Английский",
    emoji: "🌍",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&auto=format",
    price: "2 600 ₽",
    rating: 4.9,
    sessions: 376,
    bio: "Говорим с первого урока. Ошибаться не страшно — это часть игры.",
    color: "#F4BFC9",
    vibe: "hype",
    style: "visual",
    pace: "mid",
    feedback: "soft",
    goal: "career",
    tags: "Картинками,Умеренно,Энергия,Мягко",
  },
  {
    name: "Игорь Л.",
    subject: "Химия / Биология",
    emoji: "🔬",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&auto=format",
    price: "2 100 ₽",
    rating: 4.6,
    sessions: 154,
    bio: "Наука = опыты + аналогии из жизни. Сухая теория — не моё.",
    color: "#FFD47A",
    vibe: "focus",
    style: "hands",
    pace: "mid",
    feedback: "honest",
    goal: "exam",
    tags: "Практикой,Умеренно,Фокус,Честно",
  },
];

const existing = db.prepare("SELECT COUNT(*) as count FROM tutors").get();
if (existing.count > 0) {
  console.log(`База уже содержит ${existing.count} репетиторов. Пропускаем seed.`);
  console.log("Чтобы пересеять: удали файл katarsis.db и запусти seed снова.");
  process.exit(0);
}

const insert = db.prepare(`
  INSERT INTO tutors (name, subject, emoji, photo, price, rating, sessions, bio, color, vibe, style, pace, feedback, goal, tags)
  VALUES (@name, @subject, @emoji, @photo, @price, @rating, @sessions, @bio, @color, @vibe, @style, @pace, @feedback, @goal, @tags)
`);

const insertMany = db.transaction((rows) => {
  for (const row of rows) insert.run(row);
});

insertMany(tutors);
console.log(`✅ Добавлено ${tutors.length} репетиторов в базу данных.`);
