export const PINK = "#F4BFC9";
export const YELLOW = "#FFD47A";
export const MINT = "#B8F5D0";
export const LAVENDER = "#D4C5F9";
export const PEACH = "#FFD0A8";
export const SKY = "#A8D8FF";

// ─── Список предметов для поиска ──────────────────────────────────────────────
// Добавляй / убирай строки по необходимости
export const SUBJECTS = [
  // Математика
  { id: "math_ege",    label: "Математика ЕГЭ (профиль)",  emoji: "📐", group: "Математика" },
  { id: "math_base",   label: "Математика ЕГЭ (база)",     emoji: "🔢", group: "Математика" },
  { id: "math_oge",    label: "Математика ОГЭ",             emoji: "🧮", group: "Математика" },
  { id: "math_school", label: "Математика (школьная)",     emoji: "➕", group: "Математика" },
  { id: "matan",       label: "Математический анализ",     emoji: "∫",  group: "Математика" },
  { id: "linal",       label: "Линейная алгебра",           emoji: "🔷", group: "Математика" },
  { id: "terver",      label: "Теория вероятностей",        emoji: "🎲", group: "Математика" },
  { id: "diffur",      label: "Дифференциальные уравнения", emoji: "〰️", group: "Математика" },
  { id: "termeh",      label: "Теормех",                   emoji: "⚙️", group: "Математика" },
  // Русский язык
  { id: "rus_ege",     label: "Русский язык ЕГЭ",          emoji: "📝", group: "Русский язык" },
  { id: "rus_oge",     label: "Русский язык ОГЭ",          emoji: "✏️", group: "Русский язык" },
  { id: "rus_school",  label: "Русский язык (школьный)",   emoji: "📖", group: "Русский язык" },
  { id: "literature",  label: "Литература ЕГЭ",            emoji: "📚", group: "Русский язык" },
  // Физика
  { id: "phys_ege",    label: "Физика ЕГЭ",                emoji: "⚛️", group: "Физика" },
  { id: "phys_oge",    label: "Физика ОГЭ",                emoji: "🔭", group: "Физика" },
  { id: "phys_vuz",    label: "Физика (ВУЗ)",              emoji: "🔬", group: "Физика" },
  // Химия
  { id: "chem_ege",    label: "Химия ЕГЭ",                 emoji: "🧪", group: "Химия" },
  { id: "chem_oge",    label: "Химия ОГЭ",                 emoji: "⚗️", group: "Химия" },
  { id: "chem_vuz",    label: "Химия (ВУЗ)",               emoji: "🔬", group: "Химия" },
  { id: "quantum_chem",label: "Квантовая химия",           emoji: "⚛️", group: "Химия" },
  { id: "physchem",    label: "Физическая химия",          emoji: "🧬", group: "Химия" },
  { id: "crystchem",   label: "Кристаллохимия",            emoji: "💎", group: "Химия" },
  { id: "analchem",    label: "Аналитическая химия",       emoji: "🏺", group: "Химия" },
  // Биология
  { id: "bio_ege",     label: "Биология ЕГЭ",              emoji: "🧬", group: "Биология" },
  { id: "bio_oge",     label: "Биология ОГЭ",              emoji: "🌿", group: "Биология" },
  // История / Обществознание
  { id: "hist_ege",    label: "История ЕГЭ",               emoji: "🏛️", group: "История / Обществознание" },
  { id: "hist_oge",    label: "История ОГЭ",               emoji: "📜", group: "История / Обществознание" },
  { id: "soc_ege",     label: "Обществознание ЕГЭ",        emoji: "🗳️", group: "История / Обществознание" },
  { id: "soc_oge",     label: "Обществознание ОГЭ",        emoji: "⚖️", group: "История / Обществознание" },
  { id: "mhk",         label: "МХК",                       emoji: "🎨", group: "История / Обществознание" },
  // Иностранные языки
  { id: "eng_ege",     label: "Английский язык ЕГЭ",       emoji: "🇬🇧", group: "Иностранные языки" },
  { id: "eng_oge",     label: "Английский язык ОГЭ",       emoji: "🌍", group: "Иностранные языки" },
  { id: "eng_speak",   label: "Английский разговорный",    emoji: "💬", group: "Иностранные языки" },
  // Информатика / Программирование
  { id: "cs_ege",      label: "Информатика ЕГЭ",           emoji: "💾", group: "Информатика" },
  { id: "cs_oge",      label: "Информатика ОГЭ",           emoji: "🖥️", group: "Информатика" },
  { id: "python",      label: "Python",                    emoji: "🐍", group: "Информатика" },
  { id: "web",         label: "Web-разработка",            emoji: "🌐", group: "Информатика" },
  // Другое
  { id: "geo_ege",     label: "География ЕГЭ",             emoji: "🗺️", group: "Другое" },
  { id: "culture",     label: "Культурология / МХК",       emoji: "🎭", group: "Другое" },
];

export interface Tutor {
  id: number;
  name: string;
  subject: string;        // Отображаемое название предмета на карточке
  subjectIds: string[];   // ID из SUBJECTS выше — по каким предметам находится через поиск
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

// ─── Фото ─────────────────────────────────────────────────────────────────────
// Положи файл public/photos/tutor_N.png (400×400 px, квадрат)
// Если файл не найден — карточка показывает цветной фон с эмодзи
function photo(id: number): string {
  return `/photos/tutor_${id}.png`;
}

// ─── Репетиторы ───────────────────────────────────────────────────────────────
// Чтобы добавить нового — скопируй блок { ... }, дай новый id, заполни поля
export const TUTORS: Tutor[] = [
  {
    id: 1,
    name: "Арина Н.",
    subject: "Математика · Физика · Химия",
    subjectIds: ["math_ege", "math_base", "math_oge", "math_school", "phys_ege", "phys_oge", "chem_ege", "chem_oge"],
    emoji: "🌸",
    photo: photo(1),
    price: "по договорённости",
    rating: 4.9,
    sessions: 150,
    tags: ["Чилл", "Кайфово", "Добрый", "Понятно"],
    profiles: { vibe: "chill", style: "visual", pace: "slow", feedback: "soft", goal: "interest" },
    bio: "Очень чилловый и добрый преподаватель — со мной никогда не скучно. Объясняю так, что всё само укладывается в голове. Математика, физика и химия — мои три любви, и я умею эту любовь передать.",
    color: PINK,
    telegram: "arina_study",
  },
  {
    id: 2,
    name: "Валерий К.",
    subject: "Химия · Математика",
    subjectIds: ["chem_ege", "chem_oge", "chem_vuz", "math_school", "math_oge", "math_ege"],
    emoji: "⚗️",
    photo: photo(2),
    price: "от 1 500 ₽/ч",
    rating: 4.8,
    sessions: 80,
    tags: ["Практикой", "Умеренно", "Терпеливо", "Дистанционно"],
    profiles: { vibe: "chill", style: "hands", pace: "mid", feedback: "soft", goal: "exam" },
    bio: "Дистанционный формат, последовательный разбор всех нужных тем с большим упором на практику — решаем задачи, а не просто читаем теорию. Терпеливость и тактичность — мои главные качества. Готов отвечать на вопросы по теме в свободное время.",
    color: YELLOW,
    telegram: "valeruj04",
  },
  {
    id: 4,
    name: "Кирилл",
    subject: "История",
    subjectIds: ["hist_ege", "hist_oge", "soc_ege", "soc_oge"],
    emoji: "🏛️",
    photo: photo(4),
    price: "2 000 ₽/ч",
    rating: 4.9,
    sessions: 120,
    tags: ["Разговором", "Умеренно", "Творчество", "Наставник"],
    profiles: { vibe: "creative", style: "talk", pace: "mid", feedback: "soft", goal: "interest" },
    bio: "Аспирант истфака МГУ. Раскрываю суть исторических явлений, вписываю их в широкий контекст, строю структуру темы понятную для ученика — и главное, заинтересовываю в изучении прошлого. Опыт публичных лекций, подготовка к ЕГЭ на высокий балл. Весь курс отечественной и всеобщей истории, 5–11 классы.",
    color: LAVENDER,
    telegram: "kirlog",
  },
  {
    id: 5,
    name: "Людмила К.",
    subject: "Математика · Физика",
    subjectIds: ["math_ege", "math_base", "math_oge", "math_school", "phys_ege", "phys_oge"],
    emoji: "✨",
    photo: photo(5),
    price: "от 2 000 ₽/ч",
    rating: 5.0,
    sessions: 300,
    tags: ["Разговором", "Вдумчиво", "Мягко", "Стаж"],
    profiles: { vibe: "chill", style: "talk", pace: "slow", feedback: "soft", goal: "interest" },
    bio: "Репетитор со стажем. Суперски добрый и внимательный преподаватель — объясняю разговором, вдумчиво, мягко. С нами тебе будет комфортно и безопасно задавать любые вопросы. Математика и физика — в удовольствие.",
    color: PEACH,
    telegram: "Liusinija",
  },
  {
    id: 6,
    name: "Мария Э.",
    subject: "Русский язык · История · МХК",
    subjectIds: ["rus_ege", "rus_oge", "rus_school", "literature", "hist_ege", "hist_oge", "mhk", "culture", "eng_oge"],
    emoji: "🎭",
    photo: photo(6),
    price: "по договорённости",
    rating: 4.8,
    sessions: 90,
    tags: ["Картинками", "Умеренно", "Творчество", "Интерактивно"],
    profiles: { vibe: "creative", style: "visual", pace: "mid", feedback: "soft", goal: "interest" },
    bio: "Магистратура РГГУ, направление «Русская культура». Красные дипломы за школу и бакалавриат. Занятия онлайн (Google Meet + виртуальная доска miro/figma, презентации). Программа строится индивидуально: повторение → новая тема → практика. Быстро отвечаю на вопросы между занятиями. 6+ лет публичных лекций по культуре.",
    color: SKY,
    telegram: "elfiora",
  },
  {
    id: 7,
    name: "Рауф К.",
    subject: "Математика · Физика · Химия",
    subjectIds: ["math_ege", "math_oge", "phys_ege", "phys_oge", "chem_ege", "chem_oge", "quantum_chem", "matan", "linal", "terver"],
    emoji: "⚡",
    photo: photo(7),
    price: "от 2 000 ₽/ч",
    rating: 5.0,
    sessions: 60,
    tags: ["Фокус", "Разговором", "Вдумчиво", "Честно"],
    profiles: { vibe: "focus", style: "talk", pace: "slow", feedback: "honest", goal: "exam" },
    bio: "Математика, физика, химия — школа и ВУЗ. Квантовая химия — отдельная специализация. Топ крутой преподаватель: объясняю разговором, вдумчиво и честно, без лишней воды. Фокус на глубоком понимании, а не зубрёжке.",
    color: YELLOW,
    telegram: "beybars_r",
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
