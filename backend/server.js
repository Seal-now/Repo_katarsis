const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseTutor(row) {
  if (!row) return null;
  return {
    ...row,
    tags: row.tags ? row.tags.split(",") : [],
    profiles: {
      vibe: row.vibe,
      style: row.style,
      pace: row.pace,
      feedback: row.feedback,
      goal: row.goal,
    },
  };
}

// ─── GET /tutors ──────────────────────────────────────────────────────────────
// Query params: ?vibe=chill&style=visual&pace=slow&feedback=example&goal=interest
// Возвращает репетиторов, отсортированных по % совпадения если переданы параметры

app.get("/tutors", (req, res) => {
  const { vibe, style, pace, feedback, goal } = req.query;
  const filters = { vibe, style, pace, feedback, goal };
  const hasFilters = Object.values(filters).some(Boolean);

  const rows = db.prepare("SELECT * FROM tutors ORDER BY rating DESC").all();
  let tutors = rows.map(parseTutor);

  if (hasFilters) {
    const keys = Object.keys(filters).filter((k) => filters[k]);
    tutors = tutors
      .map((t) => {
        let score = 0;
        keys.forEach((k) => {
          if (t.profiles[k] === filters[k]) score++;
        });
        return { ...t, match: Math.round((score / 5) * 100) };
      })
      .sort((a, b) => b.match - a.match);
  }

  res.json(tutors);
});

// ─── GET /tutors/:id ──────────────────────────────────────────────────────────

app.get("/tutors/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM tutors WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Репетитор не найден" });
  res.json(parseTutor(row));
});

// ─── POST /tutors ─────────────────────────────────────────────────────────────

app.post("/tutors", (req, res) => {
  const {
    name, subject, emoji, photo, price, rating, sessions,
    bio, color, vibe, style, pace, feedback, goal, tags,
  } = req.body;

  if (!name || !subject || !price) {
    return res.status(400).json({ error: "Обязательные поля: name, subject, price" });
  }

  const result = db.prepare(`
    INSERT INTO tutors (name, subject, emoji, photo, price, rating, sessions, bio, color, vibe, style, pace, feedback, goal, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name, subject, emoji ?? "👤", photo ?? "", price,
    rating ?? 5.0, sessions ?? 0, bio ?? "",
    color ?? "#F4BFC9", vibe, style, pace, feedback, goal,
    Array.isArray(tags) ? tags.join(",") : tags ?? "",
  );

  const created = db.prepare("SELECT * FROM tutors WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(parseTutor(created));
});

// ─── PUT /tutors/:id ──────────────────────────────────────────────────────────

app.put("/tutors/:id", (req, res) => {
  const existing = db.prepare("SELECT * FROM tutors WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Репетитор не найден" });

  const fields = ["name", "subject", "emoji", "photo", "price", "rating", "sessions", "bio", "color", "vibe", "style", "pace", "feedback", "goal", "tags"];
  const updates = {};
  fields.forEach((f) => {
    if (req.body[f] !== undefined) {
      updates[f] = f === "tags" && Array.isArray(req.body[f]) ? req.body[f].join(",") : req.body[f];
    }
  });

  if (!Object.keys(updates).length) {
    return res.status(400).json({ error: "Нет полей для обновления" });
  }

  const setClause = Object.keys(updates).map((k) => `${k} = ?`).join(", ");
  db.prepare(`UPDATE tutors SET ${setClause} WHERE id = ?`).run(...Object.values(updates), req.params.id);

  const updated = db.prepare("SELECT * FROM tutors WHERE id = ?").get(req.params.id);
  res.json(parseTutor(updated));
});

// ─── DELETE /tutors/:id ───────────────────────────────────────────────────────

app.delete("/tutors/:id", (req, res) => {
  const existing = db.prepare("SELECT * FROM tutors WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Репетитор не найден" });

  db.prepare("DELETE FROM tutors WHERE id = ?").run(req.params.id);
  res.json({ success: true, deleted: parseTutor(existing) });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
  console.log(`   GET    /tutors          — все репетиторы`);
  console.log(`   GET    /tutors?vibe=chill&style=visual&...  — с фильтром`);
  console.log(`   GET    /tutors/:id      — один репетитор`);
  console.log(`   POST   /tutors          — добавить`);
  console.log(`   PUT    /tutors/:id      — обновить`);
  console.log(`   DELETE /tutors/:id      — удалить`);
});
