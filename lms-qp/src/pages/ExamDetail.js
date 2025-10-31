// src/pages/ExamDetail.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { exams } from '../data/exams';
import { ArrowLeft, Calendar, Clock, Users, Home } from 'lucide-react';



const ExamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const exam = exams.find(e => e.id === parseInt(id));

  // BẢO VỆ: Nếu không tìm thấy kỳ thi
  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Không tìm thấy kỳ thi</h2>
          <button
            onClick={() => navigate('/exams')}
            className="text-blue-600 hover:underline"
          >
            Quay lại danh sách kỳ thi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
          <button onClick={() => navigate('/')} className="flex items-center gap-1 hover:underline">
            <Home className="w-4 h-4" />
            Trang chủ
          </button>
          <span>/</span>
          <button onClick={() => navigate('/exams')} className="hover:underline">
            Thi trực tuyến
          </button>
          <span>/</span>
          <span className="text-blue-300">Chi tiết kỳ thi</span>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-blue-900 text-white pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{exam.title}</h1>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-blue-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Thời gian bắt đầu: {exam.startDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Thời gian kết thúc: {exam.endDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>
                Tổng số người đã đăng ký: {exam.registered?.toLocaleString() || '0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <h2 className="text-2xl font-bold mb-6">1. Cơ thi dành cho đối tượng Sĩ quan</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Thời gian bắt đầu:</strong> {exam.startDate} - 10:00</p>
                <p><strong>Thời gian làm bài:</strong> {exam.examTime} phút</p>
                <p>
                  <strong>Tổng số người đã đăng ký:</strong>{' '}
                  {exam.registered?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="mt-8">
               <button 
  onClick={() => navigate(`/exams/${exam.id}/start`)}
  className="mt-8 w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold text-lg"
>
  TIẾP TỤC LÀM BÀI
</button>
              </div>
            </div>
          </div>

          <div>
            <img 
              src={exam.image} 
              alt={exam.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ExamDetail;