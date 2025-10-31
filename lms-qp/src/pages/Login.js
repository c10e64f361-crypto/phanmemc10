// src/pages/Login.js
import React, { useState, useEffect } from 'react'; // ← THÊM useEffect
import { Link, useNavigate } from 'react-router-dom'; // ← ĐÃ CÓ useNavigate
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
  const [cccd, setCccd] = useState(''); // ← ĐÃ KHAI BÁO
  const [password, setPassword] = useState(''); // ← ĐÃ KHAI BÁO
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // TỰ ĐỘNG CHUYỂN NẾU ĐÃ LOGIN
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

// src/pages/Login.js
const handleSubmit = (e) => {
  e.preventDefault();
  login({
    cccd,
    name: 'Admin QLMS', // Tên hiển thị
    role: 'admin' // Tạm hardcode để test
  });
  navigate('/');
};
  return (
    <AuthLayout title="Đăng nhập">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Căn cước công dân
          </label>
          <input
            type="text"
            value={cccd}
            onChange={e => setCccd(e.target.value)}
            placeholder="Nhập CCCD"
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition"
        >
          Đăng nhập
        </button>
        <p className="text-center text-xs text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-red-600 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;