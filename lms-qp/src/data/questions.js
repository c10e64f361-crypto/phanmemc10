// src/data/questions.js
export const questions = [
  {
    id: 1,
    text: "Chọn đáp án đúng nhất về khái niệm chuyển đổi số?",
    options: [
      "Chuyển đổi từ analog sang digital",
      "Ứng dụng công nghệ số vào mọi lĩnh vực",
      "Chỉ áp dụng trong doanh nghiệp",
      "Chỉ liên quan đến công nghệ"
    ],
    correct: 1
  },
  {
    id: 2,
    text: "AI là viết tắt của?",
    options: ["Artificial Intelligence", "Advanced Internet", "Automated Information", "All Internet"],
    correct: 0
  },
  // ... (tổng 30 câu - mình rút gọn, bạn có thể thêm)
  {
    id: 30,
    text: "Mục tiêu của chuyển đổi số trong quốc phòng là gì?",
    options: [
      "Tăng cường năng lực tác chiến",
      "Giảm chi phí vận hành",
      "Cải thiện quản lý hành chính",
      "Tất cả các ý trên"
    ],
    correct: 3
  }
].concat(
  Array.from({ length: 28 }, (_, i) => ({
    id: i + 3,
    text: `Câu hỏi số ${i + 3}: Đây là câu hỏi mẫu số ${i + 3}?`,
    options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
    correct: Math.floor(Math.random() * 4)
  }))
);