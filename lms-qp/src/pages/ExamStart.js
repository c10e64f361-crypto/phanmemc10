// src/pages/ExamStart.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { examSessions } from '../data/examSessions';
import { ArrowLeft, Home, Clock, FileText, Award, HelpCircle } from 'lucide-react';

const ExamStart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = examSessions.find(s => s.examId === parseInt(id));

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Không tìm thấy kỳ thi</h2>
          <button onClick={() => navigate('/exams')} className="text-blue-600 hover:underline">
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
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-blue-900">
          <button onClick={() => navigate('/')} className="flex items-center gap-1 hover:underline">
            <Home className="w-4 h-4" />
            Trang chủ
          </button>
          <span>/</span>
          <button onClick={() => navigate('/exams')} className="hover:underline">
            Thi trực tuyến
          </button>
          <span>/</span>
          <span className="text-gray-600">Làm bài thi</span>
          <div className="ml-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Thông tin kỳ thi */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              THÔNG TIN CẢ THI
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>Đợt thi:</strong> {session.title}</p>
              <p><strong>Kỳ thi của tôi:</strong> {session.type}</p>
              <p><strong>Hình thức:</strong> {session.mode}</p>
              <p>
                <strong>Thời gian bắt đầu:</strong> {session.startTime}{' '}
                <strong>Thời gian kết thúc:</strong> {session.endTime}
              </p>
              <p><strong>Số lượng câu hỏi:</strong> {session.totalQuestions}</p>
              <p><strong>Thời gian làm bài:</strong> {session.duration} phút</p>
              <p><strong>Tối đa:</strong> {session.maxScore}</p>
              <p><strong>Số lần đã thi:</strong> {session.attempts}</p>
              <p><strong>Cách thức lấy điểm:</strong> {session.scoring}</p>
              <p><strong>Thông tin hỗ trợ:</strong> {session.help}</p>
            </div>

       
<button 
  onClick={() => navigate(`/exams/${id}/quiz`)}
  className="mt-8 w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold text-lg"
>
  TIẾP TỤC LÀM BÀI
</button>
          </div>

          {/* Bảng kết quả */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5" />
              KẾT QUẢ
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 py-2 text-left">STT</th>
                    <th className="px-3 py-2 text-center">Điểm</th>
                    <th className="px-3 py-2 text-center">Bắt đầu</th>
                    <th className="px-3 py-2 text-center">Nộp bài</th>
                    <th className="px-3 py-2 text-center">Vi phạm (lần)</th>
                    <th className="px-3 py-2 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {session.results.map((res, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-3 py-2">{res.stt}</td>
                      <td className="px-3 py-2 text-center">{res.score}</td>
                      <td className="px-3 py-2 text-center">{res.start}</td>
                      <td className="px-3 py-2 text-center">{res.submit}</td>
                      <td className="px-3 py-2 text-center">{res.violation}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          res.status === 'Chưa làm' 
                            ? 'bg-gray-100 text-gray-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ExamStart;