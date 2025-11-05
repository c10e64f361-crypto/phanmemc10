// src/pages/admin/UserDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Calendar, Trophy, BookOpen, Award, 
  Shield, AlertCircle 
} from 'lucide-react';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [error, setError] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // LẤY DỮ LIỆU USER + TIẾN ĐỘ
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [userRes, progressRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/learning/user/${id}`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { data: [] } }))
        ]);

        setUser(userRes.data.data);
        setNewRole(userRes.data.data.role);
        setProgress(progressRes.data.data);
        setLoading(false);
        setLoadingProgress(false);
      } catch (err) {
        console.error('Lỗi tải dữ liệu:', err);
        setError('Không thể tải thông tin học viên');
        setLoading(false);
        setLoadingProgress(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // CẬP NHẬT QUYỀN
  const handleUpdateRole = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${API_URL}/api/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...user, role: newRole });
      setShowRoleModal(false);
      alert('Cập nhật quyền thành công!');
    } catch (err) {
      alert(err.response?.data?.message || 'Cập nhật quyền thất bại');
    }
  };

  // MÀU THEO ROLE
  const getRoleColor = (role) => {
    switch (role) {
      case 'Quản trị viên': return 'bg-red-100 text-red-800';
      case 'Giáo viên': return 'bg-blue-100 text-blue-800';
      case 'Học viên': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin học viên...</p>
        </div>
      </div>
    );
  }

  // ERROR
  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <p className="text-red-700 text-lg">{error || 'Không tìm thấy học viên'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* NÚT QUAY LẠI */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại danh sách học viên
        </button>

        {/* CARD CHÍNH */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
                <p className="text-blue-100 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* THÔNG TIN */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-700">Vai trò:</span>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-700">Trạng thái:</span>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                </span>
              </div>
            </div>

            {/* THỐNG KÊ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-xl text-center border border-blue-100">
                <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-blue-700">{user.exams_taken || 0}</p>
                <p className="text-sm text-gray-600">Kỳ thi đã tham gia</p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl text-center border border-green-100">
                <Award className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-green-700">
                  {user.avg_score ? Math.round(user.avg_score) : 0}%
                </p>
                <p className="text-sm text-gray-600">Điểm trung bình</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl text-center border border-purple-100">
                <Calendar className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <p className="text-xl font-bold text-purple-700">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </p>
                <p className="text-sm text-gray-600">Ngày tham gia</p>
              </div>
            </div>

            {/* NÚT CẤP QUYỀN */}
            <div className="mb-8">
              <button
                onClick={() => setShowRoleModal(true)}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-3 shadow-lg transition transform hover:scale-105"
              >
                <Shield className="w-6 h-6" />
                Cấp quyền
              </button>
            </div>

            {/* TIẾN ĐỘ HỌC */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Tiến độ học tập
              </h2>
              {loadingProgress ? (
                <p className="text-gray-600">Đang tải tiến độ...</p>
              ) : progress.length === 0 ? (
                <div className="bg-gray-50 p-6 rounded-xl text-center">
                  <p className="text-gray-600">Chưa tham gia khóa học nào</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {progress.map(p => (
                    <div key={p.course_id} className="bg-white p-6 rounded-xl shadow border">
                      <h3 className="font-semibold text-lg mb-3">{p.course_title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-gray-600">Chương hoàn thành</p>
                          <p className="font-bold text-blue-600">
                            {p.completed_chapters} / {p.total_chapters} ({p.completion_percent}%)
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Điểm bài tập</p>
                          <p className="font-bold text-green-600">{p.quiz_score}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Huy hiệu</p>
                          <p className="font-bold text-purple-600">{p.badge || 'Chưa có'}</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-700 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${p.completion_percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* KỲ THI ĐÃ THI */}
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                Kết quả kỳ thi
              </h2>
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <p className="text-gray-600">Chưa có dữ liệu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CẤP QUYỀN */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              Cấp quyền cho <span className="text-blue-600">{user.fullName}</span>
            </h3>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition mb-5"
            >
              <option value="Học viên">Học viên</option>
              <option value="Giáo viên">Giáo viên</option>
              <option value="Quản trị viên">Quản trị viên</option>
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 border-2 border-gray-300 text-gray-700 px-5 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateRole}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-3 rounded-xl font-medium shadow-lg transition transform hover:scale-105"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;