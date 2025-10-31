// src/data/discussions.js
export const discussions = [
  {
    id: 1,
    author: "Nguyễn Văn A",
    avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random",
    content: "Tôi không hiểu rõ về Cloud Computing, ai giải thích giúp tôi với?",
    time: "2 giờ trước",
    likes: 5,
    replies: [
      {
        id: 11,
        author: "Trần Thị B",
        avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=random",
        content: "Cloud Computing là mô hình cung cấp tài nguyên CNTT qua Internet, giúp tiết kiệm chi phí và tăng tính linh hoạt.",
        time: "1 giờ trước",
        likes: 3
      }
    ],
    pinned: true
  },
  {
    id: 2,
    author: "Lê Văn C",
    avatar: "https://ui-avatars.com/api/?name=Le+Van+C&background=random",
    content: "Bài tập 2 hơi khó, có ai làm xong chưa?",
    time: "5 giờ trước",
    likes: 2,
    replies: []
  }
];