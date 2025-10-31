// src/data/courses.js
export const courses = [
  {
    id: 1,
    title: "Kiến thức chuyển đổi số",
    code: "KTCD-2025",
    image: "https://via.placeholder.com/800x400/1e40af/ffffff?text=Chuyen+Doi+So",
    description: "Nâng cao kiến thức chuyển đổi số cho cán bộ, chiến sĩ và công chức quốc phòng.",
    instructor: "TS. Nguyễn Văn A",
    duration: "20 giờ",
    level: "Cơ bản",
    startDate: "28/06/2025",
    endDate: "31/12/2025",
    price: 0,
    chapters: [
      {
        id: 1,
        title: "Chương 1: Khái niệm chuyển đổi số",
        duration: "2 giờ",
        completed: false,
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      },
      {
        id: 2,
        title: "Chương 2: Lợi ích chuyển đổi số",
        duration: "3 giờ",
        completed: true,
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      },
      {
        id: 3,
        title: "Chương 3: Ứng dụng thực tế",
        duration: "5 giờ",
        completed: false,
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    ],
    progress: 25,
    students: 1247,
    reviews: 89
  }
];