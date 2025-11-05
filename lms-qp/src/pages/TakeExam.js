// src/pages/user/TakeExam.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // LẤY THÔNG TIN KỲ THI + KẾT QUẢ ĐÃ THI
    Promise.all([
      axios.get(`${API_URL}/api/exams/${examId}`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API_URL}/api/exams/${examId}/results`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
      axios.get(`${API_URL}/api/exams/${examId}/questions`, { headers: { Authorization: `Bearer ${token}` } })
    ])
    .then(([examRes, resultRes, questionsRes]) => {
      const examData = examRes.data.data;
      const resultData = resultRes?.data?.data;
      const questionsData = questionsRes.data.data;

      // KIỂM TRA SỐ LẦN ĐÃ THI
      if (resultData && examData.max_attempts <= 1) {
        navigate(`/exams/${examId}/result`, { 
          state: { result: resultData, questions: questionsData, userAnswers: {} } 
        });
        return;
      }

      setExam(examData);
      setQuestions(questionsData);
      setTimeLeft(examData.duration * 60); // giây
      setLoading(false);
    })
    .catch(err => {
      console.error('Lỗi tải kỳ thi:', err);
      setError('Không thể tải kỳ thi');
      setLoading(false);
    });
  }, [examId, navigate]);

  // ĐẾM NGƯỢC
  useEffect(() => {
    if (timeLeft <= 0 || loading) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${API_URL}/api/exams/${examId}/results/submit`, {
        answers: Object.entries(userAnswers).map(([qid, ans]) => ({
          question_id: parseInt(qid),
          selected_answer: ans
        }))
      }, { headers: { Authorization: `Bearer ${token}` } });

      navigate(`/exams/${examId}/result`, { 
        state: { 
          result: res.data.data, 
          questions, 
          userAnswers 
        } 
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Nộp bài thất bại');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Đang tải kỳ thi...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ChevronLeft className="w-5 h-5" />
              Quay lại
            </button>
            <div className="flex items-center gap-2 text-2xl font-bold text-red-600">
              <Clock className="w-7 h-7" />
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* TIÊU ĐỀ */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h1 className="text-2xl font-bold text-blue-900 mb-2">{exam.title}</h1>
            <p className="text-gray-600">Tổng cộng {questions.length} câu hỏi • {exam.duration} phút</p>
          </div>

          {/* DANH SÁCH CÂU HỎI */}
          <div className="space-y-6">
            {questions.map((q, i) => (
              <div key={q.id} className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-medium text-lg mb-4">
                  Câu {i + 1}: {q.question_text}
                </h3>
                <div className="space-y-3">
                  {['a', 'b', 'c', 'd'].map(opt => {
                    const letter = opt.toUpperCase();
                    const isSelected = userAnswers[q.id] === letter;

                    return (
                      <label
                        key={opt}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
                          ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}
                        `}
                      >
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={letter}
                          checked={isSelected}
                          onChange={() => setUserAnswers({ ...userAnswers, [q.id]: letter })}
                          className="w-5 h-5 text-blue-600"
                        />
                        <span className="flex-1">{q[`option_${opt}`]}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* NÚT NỘP BÀI */}
          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(userAnswers).length < questions.length}
              className={`px-10 py-4 rounded-xl font-bold text-lg transition
                ${Object.keys(userAnswers).length === questions.length
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              Nộp bài
            </button>
            {Object.keys(userAnswers).length < questions.length && (
              <p className="text-sm text-gray-600 mt-2">
                Vui lòng trả lời tất cả câu hỏi
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TakeExam;