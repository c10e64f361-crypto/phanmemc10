// src/pages/admin/CoursesList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Film, FileText, Users, Clock } from 'lucide-react'; // ← ĐÃ SỬA

// ... phần còn lại giữ nguyên

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(null);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // LẤY DANH SÁCH KHÓA HỌC
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data.data);
    } catch (err) {
      console.error('Lỗi tải khóa học:', err);
      alert('Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // XÓA KHÓA HỌC
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(prev => prev.filter(c => c.id !== id));
      setShowDelete(null);
    } catch (err) {
      alert('Xóa thất bại');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Quản lý khóa học</h1>
        <Link
          to="/admin/courses/create"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Tạo khóa học mới
        </Link>
      </div>

      {/* DANH SÁCH KHÓA HỌC */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <img 
              src={`${API_URL}${course.thumbnail}`} 
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

              {/* THÔNG TIN */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration}h
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {(course.students ?? 0).toLocaleString()} học viên
                </div>
              </div>

              {/* CÁC NÚT */}
              <div className="flex gap-2">
                {/* QUẢN LÝ CHƯƠNG */}
                <Link
                  to={`/admin/courses/${course.id}/chapters`}
                  className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm transition"
                >
                  <Film className="w-4 h-4" />
                  Quản lý chương
                </Link>

                {/* BÀI TẬP */}
                <Link
                  to={`/admin/courses/${course.id}/exercises`}
                  className="flex-1 flex items-center justify-center gap-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 text-sm transition"
                >
                  <FileText className="w-4 h-4" />
                  Bài tập
                </Link>

                {/* SỬA */}
                <Link
                  to={`/admin/courses/${course.id}/edit`}
                  className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                {/* XÓA */}
                <button
                  onClick={() => setShowDelete(course.id)}
                  className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CONFIRM XÓA */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-3">Xác nhận xóa</h3>
            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn xóa khóa học này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(showDelete)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
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

export default CoursesList;