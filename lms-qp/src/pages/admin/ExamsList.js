// src/pages/admin/ExamList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Clock, Users, Calendar,FileText } from 'lucide-react';

const ExamList = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchExams = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/exams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExams(res.data.data);
    } catch (err) {
      alert('Lỗi tải kỳ thi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa kỳ thi này?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/exams/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchExams();
    } catch (err) {
      alert('Xóa thất bại');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Đang tải...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Quản lý kỳ thi</h1>
        <Link
          to="/admin/exams/create"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-5 h-5" />
          Tạo kỳ thi
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tên kỳ thi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Thời gian</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Số câu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tham gia</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {exams.map(exam => (
              <tr key={exam.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{exam.title}</p>
                    <p className="text-sm text-gray-500">{exam.code}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {exam.duration} phút
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(exam.start_time).toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{exam.question_count || 0}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {exam.participants || 0}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {/* NÚT SỬA – ĐÃ SỬA */}
                    <Link
                      to={`/admin/exams/${exam.id}/edit`}
                      className="text-blue-600 hover:text-blue-800"
                      title="Sửa kỳ thi"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    {/* NÚT XÓA */}
                    <button
                      onClick={() => handleDelete(exam.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Xóa kỳ thi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* NÚT QUẢN LÝ CÂU HỎI */}
                    <Link
                      to={`/admin/exams/${exam.id}/questions`}
                      className="text-green-600 hover:text-green-800"
                      title="Câu hỏi"
                    >
                      <FileText className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamList;