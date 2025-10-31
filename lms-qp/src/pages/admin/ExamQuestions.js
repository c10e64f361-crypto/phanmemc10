// src/pages/admin/ExamQuestions.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ExamQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Giả lập dữ liệu
  const exam = { title: "Kỳ thi kiến thức số cơ bản", questions: [
    { text: "AI là viết tắt của gì?", options: ["Artificial Intelligence", "..."], correct: 0 }
  ]};

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Quay lại
      </button>

      <h1 className="text-2xl font-bold text-blue-900 mb-6">
        Câu hỏi - {exam.title}
      </h1>

      <div className="space-y-4">
        {exam.questions.map((q, i) => (
          <div key={i} className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="font-medium mb-2">Câu {i + 1}: {q.text}</p>
            <ol className="space-y-1 text-sm">
              {q.options.map((opt, idx) => (
                <li key={idx} className={idx === q.correct ? 'text-green-600 font-medium' : ''}>
                  {String.fromCharCode(65 + idx)}. {opt}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamQuestions;