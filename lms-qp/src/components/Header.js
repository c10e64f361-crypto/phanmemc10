// src/components/Header.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Shield, Home, Book, Calendar, Library, UserCheck, FileText, Settings } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // ← DÙNG logout từ AuthContext

  // === DEBUG: Log user ===
  React.useEffect(() => {
    if (user) {
      console.log('HEADER DEBUG - USER:', user);
    }
  }, [user]);

  // Nếu chưa login → không hiện header
  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  // Danh sách menu người dùng
  const userMenu = [
    { path: '/', label: 'Trang chủ', icon: Home },
    { path: '/courses', label: 'Khóa học', icon: Book },
    { path: '/exams', label: 'Kỳ thi', icon: Calendar },
    { path: '/library', label: 'Tài liệu', icon: Library },
    { path: '/my-courses', label: 'Lớp của tôi', icon: UserCheck },
    { path: '/my-exams', label: 'Kỳ thi của tôi', icon: FileText },
    { path: '/certificates', label: 'Chứng chỉ', icon: FileText },
  ];

  // Hàm logout tùy chỉnh (gọi logout() + chuyển trang)
  const handleLogout = () => {
    logout(); // Xóa localStorage + setUser(null)
    navigate('/login', { replace: true }); // Chuyển về login
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">

          {/* === LOGO + TIÊU ĐỀ === */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo-qp.png" 
              alt="Bộ Quốc Phòng" 
              className="h-12 w-12 object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <div className="text-xl font-bold tracking-wider">BAN THAM MƯU</div>
              <div className="text-xs opacity-90">HỆ THỐNG QUẢN LÝ ĐÀO TẠO</div>
            </div>
          </div>

          {/* === THÔNG TIN NGƯỜI DÙNG + LOGOUT === */}
          <div className="flex items-center gap-4">

            {/* DEBUG ROLE + TÊN */}
            <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium">
              <Shield className={`w-4 h-4 ${user.role === 'Quản trị viên' ? 'text-yellow-400' : 'text-cyan-300'}`} />
              <span className={user.role === 'Quản trị viên' ? 'text-yellow-300' : 'text-cyan-200'}>
                {user.role.toUpperCase()}
              </span>
              <span className="text-white/80">• {user.fullName || user.cccd}</span>
            </div>

            {/* NÚT QUẢN TRỊ (chỉ Admin) */}
            {user.role === 'Quản trị viên' && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-yellow-500 text-blue-900 font-bold'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden md:inline">Quản trị</span>
              </Link>
            )}

            {/* ĐĂNG XUẤT */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* === MENU NGANG (chỉ user, không phải admin) === */}
        {user.role !== 'Quản trị viên' && (
          <nav className="flex gap-1 pb-2 overflow-x-auto scrollbar-hide">
            {userMenu.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition whitespace-nowrap text-sm ${
                  isActive(item.path)
                    ? 'bg-white text-blue-900 font-semibold shadow-md'
                    : 'hover:bg-white/10'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;