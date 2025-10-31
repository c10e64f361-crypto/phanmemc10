// src/pages/admin/ExamsList.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { adminExams } from '../../data/adminExams';
import { Plus, Edit, Trash2, Clock, FileQuestion, Calendar } from 'lucide-react';

const ExamsList = () => {
  const [exams, setExams] = useState(adminExams);
  const [showDelete, setShowDelete] = useState(null);

  const handleDelete = (id) => {
    setExams(prev => prev.filter(e => e.id !== id));
    setShowDelete(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Quản lý kỳ thi</h1>
        <Link
          to="/admin/exams/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Tạo kỳ thi mới
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map(exam => (
          <div key={exam.id} className="bg-white rounded-lg shadow-sm border p-5">
            <h3 className="font-semibold text-lg mb-3">{exam.title}</h3>
            
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Bắt đầu: {new Date(exam.startTime).toLocaleString('vi-VN')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Kết thúc: {new Date(exam.endTime).toLocaleString('vi-VN')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Thời gian: {exam.duration} phút</span>
              </div>
              <div className="flex items-center gap-2">
                <FileQuestion className="w-4 h-4" />
                <span>{exam.questions.length} câu hỏi</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                to={`/admin/exams/${exam.id}/questions`}
                className="flex-1 text-center bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm"
              >
                Câu hỏi
              </Link>
              <Link
                to={`/admin/exams/${exam.id}/edit`}
                className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                <Edit className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setShowDelete(exam.id)}
                className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Xác nhận xóa */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-3">Xác nhận xóa</h3>
            <p className="text-gray-700 mb-6">Bạn có chắc chắn muốn xóa kỳ thi này?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(null)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(showDelete)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamsList;