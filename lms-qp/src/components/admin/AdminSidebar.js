// src/components/admin/AdminSidebar.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, BookOpen, FileText, Users, BarChart3, Award, Settings, 
  FileQuestion, FileSpreadsheet, LogOut 
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: BookOpen, label: 'Khóa học', path: '/admin/courses' },
    { icon: FileText, label: 'Kỳ thi', path: '/admin/exams' },
    { icon: FileSpreadsheet, label: 'Tài liệu', path: '/admin/documents' }, // THAY "Lịch thi" → "Tài liệu"
    { icon: FileQuestion, label: 'Ngân hàng câu hỏi', path: '/admin/question-bank' },
    { icon: Users, label: 'Học viên', path: '/admin/users' },
    { icon: BarChart3, label: 'Báo cáo', path: '/admin/reports' },
    { icon: Award, label: 'Chứng chỉ', path: '/admin/certificates' },
    { icon: Settings, label: 'Cài đặt', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <div className="w-64 bg-blue-900 text-white min-h-screen p-4 fixed left-0 top-0 bottom-0 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-center">LMS hỌC TẬP</h2>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive 
                  ? 'bg-blue-700 text-white shadow-md' 
                  : 'text-blue-200 hover:bg-blue-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-8">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-blue-800 rounded-lg w-full transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;