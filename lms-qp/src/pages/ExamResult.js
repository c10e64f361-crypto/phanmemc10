// src/pages/user/ExamResult.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ChevronLeft, Trophy } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ExamResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.result || !state.questions) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-center">
        <Header />
        <p className="text-red-600 mt-20">Không có dữ liệu kết quả</p>
        <Footer />
      </div>
    );
  }

  const { result, questions, userAnswers } = state;
  const correctCount = result.correct_answers || 0; // ĐÚNG TÊN
  const totalQuestions = questions.length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* NÚT QUAY LẠI */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Quay lại
          </button>

          {/* TỔNG KẾT */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Hoàn thành kỳ thi!</h1>
            <div className="flex justify-center items-center gap-8 mt-6">
              <div>
                <p className="text-5xl font-bold text-green-600">{result.score}%</p>
                <p className="text-gray-600">Điểm số</p>
              </div>
              <div className="border-l pl-8">
                <p className="text-5xl font-bold text-blue-600">{correctCount}/{totalQuestions}</p>
                <p className="text-gray-600">Câu đúng</p>
              </div>
            </div>
          </div>

          {/* CHI TIẾT CÂU HỎI */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-blue-900 mb-6">Chi tiết đáp án</h2>
            <div className="space-y-6">
              {questions.map((q, i) => {
                const userAns = userAnswers[q.id];
                const isCorrect = q.correct_answer === userAns;

                return (
                  <div 
                    key={q.id} 
                    className={`border-2 rounded-xl p-5 transition-all ${
                      isCorrect 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg">
                        Câu {i + 1}: {q.question_text}
                      </h3>
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {['a', 'b', 'c', 'd'].map(opt => {
                        const letter = opt.toUpperCase();
                        const isUserAnswer = userAns === letter;
                        const isCorrectAnswer = q.correct_answer === letter;

                        return (
                          <div
                            key={opt}
                            className={`p-3 rounded-lg border-2 font-medium transition-all
                              ${isCorrectAnswer 
                                ? 'border-green-500 bg-green-100 text-green-800' 
                                : isUserAnswer 
                                ? 'border-red-500 bg-red-100 text-red-800'
                                : 'border-gray-300 bg-gray-50 text-gray-700'
                              }`}
                          >
                            <span className="font-bold">{letter}.</span> {q[`option_${opt}`]}
                            {isCorrectAnswer && <span className="ml-2 text-xs">(Đáp án đúng)</span>}
                            {isUserAnswer && !isCorrectAnswer && <span className="ml-2 text-xs">(Bạn chọn)</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExamResult;