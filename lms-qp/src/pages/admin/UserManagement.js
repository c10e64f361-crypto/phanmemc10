// src/pages/admin/UserManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, ChevronRight, User, Mail, Calendar, Trophy, 
  Shield, AlertCircle 
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [cccd, setCccd] = useState('');
  const [status, setStatus] = useState('');
  const [courseId, setCourseId] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập');
      setLoading(false);
      return;
    }

    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (cccd) params.append('cccd', cccd);
    if (status) params.append('status', status);
    if (courseId) params.append('course_id', courseId);

    axios.get(`${API_URL}/api/users?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUsers(res.data.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Lỗi tải danh sách học viên:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      setLoading(false);
    });
  }, [search, cccd, status, courseId]);

  const getRoleColor = (role) => {
    switch (role) {
      case 'Quản trị viên': return 'bg-red-100 text-red-800';
      case 'Giáo viên': return 'bg-blue-100 text-blue-800';
      case 'Học viên': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCCCD = (cccd) => {
    if (!cccd) return '—';
    return cccd.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách học viên...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <p className="text-red-700 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* TIÊU ĐỀ */}
        <h1 className="text-3xl font-bold text-blue-900 mb-8">
          Quản lý học viên <span className="text-lg text-gray-600">({users.length} người)</span>
        </h1>

        {/* TÌM KIẾM + LỌC */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* TÌM THEO TÊN/EMAIL */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm tên, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* TÌM THEO CCCD */}
            <div className="relative">
              <Shield className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo CCCD..."
                value={cccd}
                onChange={(e) => setCccd(e.target.value.replace(/\D/g, '').slice(0, 12))}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-mono"
                maxLength="12"
              />
            </div>

            {/* LỌC TRẠNG THÁI */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>

            {/* LỌC KHÓA HỌC */}
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Tất cả khóa học</option>
              <option value="1">Chuyển đổi số</option>
              <option value="2">AI cơ bản</option>
            </select>
          </div>
        </div>

        {/* DANH SÁCH HỌC VIÊN */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Học viên
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                    CCCD
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Kỳ thi
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Điểm TB
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Quyền
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-16 text-center text-gray-500">
                      <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>Không tìm thấy học viên nào</p>
                    </td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id} className="hover:bg-blue-50 transition">
                      {/* HỌ TÊN + AVATAR */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.fullName || 'Chưa đặt tên'}</p>
                            <p className="text-xs text-gray-500">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* CCCD */}
                      <td className="px-6 py-4">
                        <p className="font-mono text-sm text-gray-700">
                          {formatCCCD(user.cccd)}
                        </p>
                      </td>

                      {/* EMAIL */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{user.email}</span>
                        </div>
                      </td>

                      {/* KỲ THI */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="font-bold text-gray-900">{user.exams_taken || 0}</span>
                        </div>
                      </td>

                      {/* ĐIỂM TB */}
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-blue-600">
                          {user.avg_score ? Math.round(user.avg_score) + '%' : '—'}
                        </span>
                      </td>

                      {/* TRẠNG THÁI */}
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                        </span>
                      </td>

                      {/* QUYỀN */}
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>

                      {/* THAO TÁC */}
                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition"
                        >
                          Chi tiết
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;