// src/data/examSessions.js
export const examSessions = [
  {
    id: 1,
    examId: 1,
    title: "Đợt thi: Thi thử đợt 1",
    type: "Thi thử đợt 1",
    mode: "Online",
    startTime: "08:00 25/08/2025",
    endTime: "23:59 31/12/2025",
    totalQuestions: 30,
    duration: 45, // phút
    maxScore: 20,
    attempts: 0,
    scoring: "Cao nhất",
    help: "Thông tin hỗ trợ",
    results: [
      {
        stt: 1,
        score: "-",
        start: "-",
        submit: "-",
        violation: "-",
        status: "Chưa làm"
      }
    ]
  }
];