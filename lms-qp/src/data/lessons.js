// src/data/lessons.js
export const lessons = [
  {
    id: 1,
    title: "2.1. Các xu hướng công nghệ số phổ biến phục vụ chuyển đổi số trong khu vực công",
    type: "video",
    duration: "15:30",
    status: "completed",
    children: [
      { id: 11, title: "2.1.1. Các khái niệm về công nghệ số tiêu biểu", status: "completed" },
      { id: 12, title: "2.1.2. Điện toán đám mây (Cloud computing)", status: "current" },
      { id: 13, title: "2.1.3. Trí tuệ nhân tạo (AI) và AI tạo sinh (Generative AI)", status: "locked" },
      { id: 14, title: "2.1.4. Dữ liệu lớn và phân tích dữ liệu (Big Data & Analytics)", status: "locked" },
      { id: 15, title: "2.1.5. Internet vạn vật (IoT)", status: "locked" },
    ]
  },
  {
    id: 2,
    title: "2.2. Định hướng phát triển các công nghệ số chiến lược",
    type: "video",
    duration: "20:00",
    status: "locked",
    children: [
      { id: 21, title: "2.2.1. Tổng quan về công nghệ số chiến lược", status: "locked" },
      { id: 22, title: "2.2.2. Phát triển hạ tầng số hiện đại và bền vững", status: "locked" },
      { id: 23, title: "2.2.3. Công nghệ lõi và công nghệ nền tảng số", status: "locked" },
      { id: 24, title: "2.2.4. Định hướng phát triển công nghệ số trong các ngành trọng điểm", status: "locked" },
    ]
  },
  { id: 3, title: "Quiz: Kiến thức về công nghệ số", type: "quiz", status: "locked" }
];