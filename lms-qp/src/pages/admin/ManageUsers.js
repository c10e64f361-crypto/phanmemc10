// src/pages/admin/ManageUsers.js
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search, Lock, Unlock } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, cccd: '123456789012', name: 'Nguyễn Văn A', email: 'a@example.com', status: 'Hoạt động' },
    { id: 2, cccd: '987654321098', name: 'Trần Thị B', email: 'b@example.com', status: 'Bị khóa' },
  ]);
  const [search, setSearch] = useState('');

  const filtered = users.filter(u => 
    u.cccd.includes(search) || u.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleLock = (id) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === 'Hoạt động' ? 'Bị khóa' : 'Hoạt động' } : u
    ));
  };

  return (
    <AdminLayout title="Quản lý người dùng">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo CCCD hoặc tên..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">CCCD</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Họ tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm">{user.cccd}</td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4 text-sm">{user.email}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === 'Hoạt động' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => toggleLock(user.id)}
                    className={`p-2 rounded-lg ${user.status === 'Hoạt động' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                  >
                    {user.status === 'Hoạt động' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;