// src/data/questionsBank.js
export const questionsBank = [
  {
    id: 1,
    text: "AI là viết tắt của gì?",
    options: ["Artificial Intelligence", "Advanced Internet", "Automated Info", "All Internet"],
    correct: 0,
    topic: "AI"
  },
  {
    id: 2,
    text: "Cloud Computing là gì?",
    options: ["Máy tính đám mây", "Dịch vụ điện toán đám mây", "Lưu trữ cục bộ", "Phần mềm offline"],
    correct: 1,
    topic: "Cloud"
  },
  // Thêm 28 câu mẫu
].concat(
  Array.from({ length: 28 }, (_, i) => ({
    id: i + 3,
    text: `Câu hỏi ${i + 3}: Đây là nội dung câu hỏi mẫu về công nghệ số?`,
    options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
    correct: Math.floor(Math.random() * 4),
    topic: ["AI", "Cloud", "Cybersecurity", "Digital"][Math.floor(Math.random() * 4)]
  }))
);