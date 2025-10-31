// src/components/ExamCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Clock, Eye } from 'lucide-react';

const ExamCard = ({ exam }) => {
  // BẢO VỆ: Nếu exam null/undefined → không render
  if (!exam) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thông tin */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">
            1. Cơ thi dành cho đối tượng Sĩ quan
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Thời gian bắt đầu: {exam.startDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Thời gian làm bài: {exam.examTime} phút</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>
                Tổng số người đã đăng ký: {exam.registered?.toLocaleString() || '0'}
              </span>
            </div>
          </div>
          <div className="mt-6">
            <Link
              to={`/exams/${exam.id}`}
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <Eye className="w-4 h-4" />
              XEM CHI TIẾT
            </Link>
          </div>
        </div>

        {/* Hình ảnh */}
        <div className="flex justify-center md:justify-end">
          <img 
            src={exam.image} 
            alt={exam.title}
            className="w-48 h-32 object-cover rounded-lg shadow"
          />
        </div>
      </div>
    </div>
  );
};

export default ExamCard;