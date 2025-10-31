// src/components/admin/AdminSidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Book, Users, Award, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menu = [
    { label: 'Dashboard', path: '/admin', icon: Home },
    { label: 'Khóa học', path: '/admin/courses', icon: Book },
    { label: 'Người dùng', path: '/admin/users', icon: Users },
    { label: 'Chứng chỉ', path: '/admin/certificates', icon: Award },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-blue-900 text-white">
      <div className="p-6 border-b border-blue-800">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Award className="w-6 h-6" />
          ADMIN QLMS
        </h2>
      </div>
      <nav className="mt-6">
        {menu.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-blue-800 transition ${
              location.pathname === item.path ? 'bg-blue-800 border-l-4 border-yellow-400' : ''
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-6 py-3 hover:bg-red-800 w-full text-left transition mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;