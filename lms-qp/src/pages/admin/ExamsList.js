// src/pages/admin/ExamsList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Clock, Calendar, Users } from 'lucide-react';

const ExamsList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showDelete, setShowDelete] = useState(null);

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // LẤY DANH SÁCH KỲ THI
  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = search ? { search } : {};
    axios.get(`${API_URL}/api/exams`, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setExams(res.data.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Lỗi tải kỳ thi:', err);
      setLoading(false);
    });
  }, [search]);

  // XÓA KỲ THI
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/api/exams/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExams(prev => prev.filter(e => e.id !== id));
      setShowDelete(null);
    } catch (err) {
      alert('Xóa thất bại');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Quản lý kỳ thi</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Tìm kiếm kỳ thi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
          />
          <Link
            to="/admin/exams/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-5 h-5" />
            Tạo kỳ thi
          </Link>
        </div>
      </div>

      {/* BẢNG KỲ THI */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên kỳ thi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời lượng
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lần thi
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exams.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    Chưa có kỳ thi nào
                  </td>
                </tr>
              ) : (
                exams.map(exam => {
                  const start = new Date(exam.start_time);
                  const end = new Date(exam.end_time);
                  const now = new Date();
                  const status = now < start ? 'Chưa mở' : now <= end ? 'Đang mở' : 'Đã kết thúc';

                  return (
                    <tr key={exam.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{exam.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{exam.description}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {start.toLocaleString('vi-VN')} - {end.toLocaleString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{exam.duration} phút</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{exam.max_attempts}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          status === 'Đang mở' ? 'bg-green-100 text-green-800' :
                          status === 'Chưa mở' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* CÂU HỎI */}
                          <Link
                            to={`/admin/exams/${exam.id}/questions`}
                            className="text-indigo-600 hover:text-indigo-800"
                            title="Câu hỏi"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          {/* SỬA */}
                          <Link
                            to={`/admin/exams/${exam.id}/edit`}
                            className="text-blue-600 hover:text-blue-800"
                            title="Sửa"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          {/* XÓA */}
                          <button
                            onClick={() => setShowDelete(exam.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Xóa"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRM XÓA */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-3">Xác nhận xóa</h3>
            <p className="text-gray-700 mb-6">
              Xóa kỳ thi này sẽ xóa cả câu hỏi. Bạn có chắc chắn?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(null)}
                className="flex-1 border px-4 py-2 rounded hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(showDelete)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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