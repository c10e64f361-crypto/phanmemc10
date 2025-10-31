// src/pages/QuizExam.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { questions } from '../data/questions';
import { Clock, AlertCircle, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const QuizExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 phút
  const [showConfirm, setShowConfirm] = useState(false);
  const intervalRef = useRef(null);

  // Đếm ngược
  useEffect(() => {
    if (timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else {
      handleSubmit();
    }
    return () => clearInterval(intervalRef.current);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAnswer = (qid, aid) => {
    setAnswers(prev => ({ ...prev, [qid]: aid }));
  };

  const handleSubmit = () => {
    clearInterval(intervalRef.current);
    const score = questions.reduce((acc, q) => {
      return answers[q.id] === q.correct ? acc + 1 : acc;
    }, 0);
    alert(`Bạn đã hoàn thành! Điểm: ${score}/${questions.length}`);
    navigate(`/exams/${id}/result`);
  };

  const question = questions[currentQ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Header thi */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ChevronLeft className="w-5 h-5" />
              Quay lại
            </button>
            <h1 className="text-xl font-bold text-blue-900">Câu {currentQ + 1}/30</h1>
          </div>
          <div className={`flex items-center gap-2 text-lg font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-blue-900'}`}>
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Câu hỏi */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">
              Câu {currentQ + 1}: {question.text}
            </h2>
            <div className="space-y-3">
              {question.options.map((opt, idx) => (
                <label
                  key={idx}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                    answers[question.id] === idx
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${question.id}`}
                    checked={answers[question.id] === idx}
                    onChange={() => handleAnswer(question.id, idx)}
                    className="mr-3"
                  />
                  <span className="flex-1">{opt}</span>
                  {answers[question.id] === idx && <CheckCircle className="w-5 h-5 text-blue-600" />}
                </label>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                disabled={currentQ === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Câu trước
              </button>
              <button
                onClick={() => setCurrentQ(Math.min(questions.length - 1, currentQ + 1))}
                disabled={currentQ === questions.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Câu sau
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Danh sách câu hỏi */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold mb-4">Danh sách câu hỏi</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQ(idx)}
                className={`w-10 h-10 rounded-lg font-medium transition ${
                  idx === currentQ
                    ? 'bg-blue-600 text-white'
                    : answers[q.id] !== undefined
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="mt-6 w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
          >
            NỘP BÀI
          </button>
        </div>
      </div>

      {/* Xác nhận nộp bài */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center gap-3 text-yellow-600 mb-4">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Xác nhận nộp bài</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Bạn đã trả lời <strong>{Object.keys(answers).length}</strong> / 30 câu. 
              Sau khi nộp, bạn <strong>không thể sửa</strong>. Bạn có chắc chắn?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default QuizExam;