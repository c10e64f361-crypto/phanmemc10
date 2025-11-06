// src/pages/Register.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

// DÙNG ENV CHO API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Register = () => {
  const [form, setForm] = useState({
    cccd: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // TỰ ĐỘNG CHUYỂN NẾU ĐÃ LOGIN
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Kiểm tra
    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (form.cccd.length !== 12 || !/^\d+$/.test(form.cccd)) {
      setError('CCCD phải có đúng 12 chữ số');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cccd: form.cccd,
          fullName: form.fullName,
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Đăng ký thất bại');
        setLoading(false);
        return;
      }

      // ĐĂNG NHẬP TỰ ĐỘNG SAU KHI ĐĂNG KÝ
      login(data.user, data.token);

      // CHUYỂN HƯỚNG THEO VAI TRÒ
      if (data.user.role === 'Quản trị viên') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Đăng ký tài khoản">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* CCCD */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Căn cước công dân
          </label>
          <input
            type="text"
            name="cccd"
            placeholder="Nhập CCCD (12 số)"
            value={form.cccd}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            disabled={loading}
            pattern="[0-9]{12}"
            title="CCCD phải có đúng 12 chữ số"
          />
        </div>

        {/* Họ tên */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="Nhập họ và tên"
            value={form.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            disabled={loading}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Nhập email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            disabled={loading}
          />
        </div>

        {/* Mật khẩu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            name="password"
            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            minLength="6"
            disabled={loading}
          />
        </div>

        {/* Xác nhận mật khẩu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            disabled={loading}
          />
        </div>

        {/* Lỗi */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Nút Đăng ký */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 rounded-lg font-medium transition flex items-center justify-center ${
            loading
              ? 'bg-red-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Đang xử lý...
            </>
          ) : (
            'Đăng ký'
          )}
        </button>

        <p className="text-center text-xs text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-red-600 hover:underline font-medium">
            Đăng nhập ngay
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;