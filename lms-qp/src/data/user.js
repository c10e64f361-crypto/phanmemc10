// src/data/users.js
export const users = [
  {
    id: 1,
    fullName: "Nguyễn Văn An",
    email: "an.nv@example.com",
    cccd: "123456789",
    role: "Học viên",
    coursesCompleted: 2,
    totalCourses: 5,
    examsPassed: 1,
    totalExams: 3,
    lastActive: "2025-10-30T14:30:00"
  },
  {
    id: 2,
    fullName: "Trần Thị Bình",
    email: "binh.tt@example.com",
    cccd: "987654321",
    role: "Giáo viên",
    coursesCompleted: 0,
    totalCourses: 0,
    examsPassed: 0,
    totalExams: 0,
    lastActive: "2025-10-29T09:15:00"
  }
].concat(
  Array.from({ length: 28 }, (_, i) => ({
    id: i + 3,
    fullName: `Học viên ${i + 3}`,
    email: `hocvien${i + 3}@example.com`,
    cccd: `${100000000 + i}`.padStart(9, '0'),
    role: ["Học viên", "Giáo viên", "Quản trị viên"][Math.floor(Math.random() * 3)],
    coursesCompleted: Math.floor(Math.random() * 6),
    totalCourses: 5,
    examsPassed: Math.floor(Math.random() * 4),
    totalExams: 3,
    lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
  }))
);