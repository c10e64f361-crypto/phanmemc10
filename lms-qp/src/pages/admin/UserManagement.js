// src/pages/admin/UserManagement.js
import React, { useState, useMemo } from 'react';
import { users } from '../../data/user';
import { Search, Filter, Edit, Shield, UserCheck, Clock, Award } from 'lucide-react';

const UserManagement = () => {
  const [userList, setUserList] = useState(users);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showEditRole, setShowEditRole] = useState(null);
  const [newRole, setNewRole] = useState('');

  const itemsPerPage = 10;

  // Lọc + Tìm kiếm
  const filteredUsers = useMemo(() => {
    return userList.filter(u => {
      const matchesSearch = 
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.cccd.includes(search);
      const matchesRole = !roleFilter || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [userList, search, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const roles = ["Học viên", "Giáo viên", "Quản trị viên"];

  const handleRoleChange = (userId) => {
    setUserList(prev => prev.map(u =>
      u.id === userId ? { ...u, role: newRole } : u
    ));
    setShowEditRole(null);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Hôm nay";
    if (days === 1) return "Hôm qua";
    return `${days} ngày trước`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Quản lý học viên</h1>

      {/* Tìm kiếm + Lọc */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm tên, email, CCCD..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Tất cả vai trò</option>
            {roles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bảng học viên */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Họ tên</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Email / CCCD</th>
              <th className="px-4 py-3 text-center text-sm font-medium">Vai trò</th>
              <th className="px-4 py-3 text-center text-sm font-medium">Tiến độ học</th>
              <th className="px-4 py-3 text-center text-sm font-medium">Kỳ thi</th>
              <th className="px-4 py-3 text-center text-sm font-medium">Hoạt động</th>
              <th className="px-4 py-3 text-center text-sm font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                      {user.fullName.charAt(0)}
                    </div>
                    <span className="font-medium">{user.fullName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div>{user.email}</div>
                  <div className="text-gray-500">CCCD: {user.cccd}</div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'Quản trị viên' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'Giáo viên' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <Award className="w-4 h-4 text-yellow-600" />
                    <span>{user.coursesCompleted}/{user.totalCourses}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(user.coursesCompleted / user.totalCourses) * 100}%` }}
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm">
                  {user.examsPassed}/{user.totalExams}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(user.lastActive)}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => {
                      setShowEditRole(user.id);
                      setNewRole(user.role);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal cấp quyền */}
      {showEditRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Cấp quyền
            </h3>
            <div className="space-y-3">
              {roles.map(role => (
                <label
                  key={role}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition ${
                    newRole === role ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  <span>{role}</span>
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={newRole === role}
                    onChange={e => setNewRole(e.target.value)}
                    className="ml-2"
                  />
                </label>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditRole(null)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleRoleChange(showEditRole)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;