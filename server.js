import axios from "axios";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX;

const figures = [
  { name: "세종대왕", hint: "한글 창제" },
  { name: "이순신", hint: "명량해전 승리" },
  { name: "간디", hint: "인도의 독립운동 지도자" },
  { name: "링컨", hint: "미국 노예 해방" },
  { name: "아인슈타인", hint: "상대성이론" },
  { name: "유관순", hint: "3·1운동 참여" },
  { name: "소크라테스", hint: "고대 그리스 철학자" },
  { name: "신사임당", hint: "조선 시대 화가이자 율곡 이이의 어머니" },
  { name: "정약용", hint: "조선의 실학자, 다산" }
];

let usedIndexes = [];
let today = new Date().toDateString();
let callCount = 0;
const DAILY_LIMIT = 100;

function resetIfNewDay() {
  const now = new Date().toDateString();
  if (now !== today) {
    today = now;
    callCount = 0;
    usedIndexes = [];
  }
}

export default async function handler(req, res) {
  resetIfNewDay();

  if (callCount >= DAILY_LIMIT) {
    return res.status(429).json({ error: "일일 호출 한도 초과" });
  }

  try {
    const availableIndexes = figures
      .map((_, i) => i)
      .filter(i => !usedIndexes.includes(i));

    if (availableIndexes.length === 0) usedIndexes = [];

    const selectedIndex =
      availableIndexes[Math.floor(Math.random() * availableIndexes.length)];

    usedIndexes.push(selectedIndex);

    const question = figures[selectedIndex];

    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&searchType=image&q=${encodeURIComponent(question.name)}`;

    const { data } = await axios.get(url);
    const imageUrl = data.items?.[0]?.link || "";

    callCount++;

    res.status(200).json({
      name: question.name,
      hint: question.hint,
      imageUrl,
      remaining: DAILY_LIMIT - callCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

app.listen(3000, () => console.log("✅ 서버 실행 중: http://localhost:3000"));

