// src/pages/user/ExamDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, ChevronLeft, PlayCircle, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
const ExamDetail = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [userResult, setUserResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    Promise.all([
      axios.get(`${API_URL}/api/exams/${examId}`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API_URL}/api/exams/${examId}/results`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { data: null } }))
    ])
    .then(([examRes, resultRes]) => {
      setExam(examRes.data.data);
      setUserResult(resultRes.data.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Lỗi tải kỳ thi:', err);
      setError('Không thể tải thông tin kỳ thi');
      setLoading(false);
    });
  }, [examId, navigate]);

  const getExamStatus = () => {
    if (!exam) return null;
    const now = new Date();
    const start = new Date(exam.start_time);
    const end = new Date(exam.end_time);

    if (now < start) return { label: 'Chưa mở', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle };
    if (now >= start && now <= end) return { label: 'Đang mở', color: 'bg-green-100 text-green-800', icon: PlayCircle };
    return { label: 'Đã kết thúc', color: 'bg-gray-100 text-gray-800', icon: null };
  };

  const status = getExamStatus();
  const now = new Date();
  const isOpen = exam && now >= new Date(exam.start_time) && now <= new Date(exam.end_time);
  const hasTaken = userResult !== null;
  const canTake = isOpen && (!hasTaken || exam?.max_attempts > 1);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            Quay lại danh sách kỳ thi
          </button>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error || !exam ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <p className="text-red-700 text-lg">{error || 'Kỳ thi không tồn tại'}</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{exam.title}</h1>
                <p className="text-blue-100 text-lg leading-relaxed max-w-3xl">
                  {exam.description || 'Kỳ thi kiểm tra kiến thức chuyên sâu'}
                </p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-xl border border-blue-100">
                    <Calendar className="w-10 h-10 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Thời gian thi</p>
                      <p className="font-bold text-gray-900">
                        {new Date(exam.start_time).toLocaleString('vi-VN')}
                      </p>
                      <p className="text-sm text-gray-700">đến {new Date(exam.end_time).toLocaleTimeString('vi-VN')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-5 bg-green-50 rounded-xl border border-green-100">
                    <Clock className="w-10 h-10 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Thời lượng</p>
                      <p className="text-3xl font-bold text-green-700">{exam.duration}</p>
                      <p className="text-sm text-gray-700">phút</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-5 bg-purple-50 rounded-xl border border-purple-100">
                    <Users className="w-10 h-10 text-purple-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Số lần thi</p>
                      <p className="text-3xl font-bold text-purple-700">{exam.max_attempts}</p>
                      <p className="text-sm text-gray-700">lần tối đa</p>
                    </div>
                  </div>
                </div>

                {/* KẾT QUẢ ĐÃ THI */}
                {hasTaken && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 text-center">
                    <p className="text-lg font-semibold text-blue-900">
                      Bạn đã thi <strong>1</strong> lần
                    </p>
                    <p className="text-2xl font-bold text-blue-700 mt-2">
                      Điểm: {userResult.score}%
                    </p>
                    {exam.max_attempts > 1 && (
                      <p className="text-sm text-blue-600 mt-1">
                        Còn {exam.max_attempts - 1} lần thi
                      </p>
                    )}
                  </div>
                )}

                {/* TRẠNG THÁI + NÚT HÀNH ĐỘNG */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    {status.icon && <status.icon className="w-7 h-7" />}
                    <span className={`px-5 py-2 rounded-full text-sm font-bold ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  <div>
                    {canTake ? (
                      <Link
                        to={`/exams/${exam.id}/take`}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 text-lg shadow-lg transition transform hover:scale-105"
                      >
                        <PlayCircle className="w-7 h-7" />
                        {hasTaken ? 'Thi lại' : 'Bắt đầu làm bài'}
                      </Link>
                    ) : status.label === 'Chưa mở' ? (
                      <div className="text-center">
                        <p className="font-semibold text-gray-700">Sắp mở vào</p>
                        <p className="text-lg font-bold text-blue-600">
                          {new Date(exam.start_time).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    ) : hasTaken ? (
                      <div className="text-center">
                        <p className="font-semibold text-gray-700">Bạn đã hoàn thành</p>
                        <Link
                          to={`/exams/${exam.id}/result`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Xem kết quả
                        </Link>
                      </div>
                    ) : (
                      <div className="text-center text-gray-600">
                        <p className="font-medium">Đã kết thúc</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExamDetail;