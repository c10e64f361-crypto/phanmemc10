// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Login = () => {
  const [cccd, setCccd] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // TỰ ĐỘNG CHUYỂN TRANG KHI user CÓ GIÁ TRỊ
  useEffect(() => {
    if (user) {
      const target = user.role === 'Quản trị viên' ? '/admin' : '/';
      navigate(target, { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cccd, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Đăng nhập thất bại');
        setLoading(false);
        return;
      }

      login(data.user, data.token);

    } catch (err) {
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
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
            onChange={(e) => setCccd(e.target.value)}
            placeholder="Nhập CCCD"
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 rounded-lg font-medium transition flex items-center justify-center ${
            loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

        <p className="text-center text-xs text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-red-600 hover:underline font-medium">
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;