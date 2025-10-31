// src/pages/Register.js
import React, { useState, useEffect } from 'react'; // ← THÊM useEffect
import { Link, useNavigate } from 'react-router-dom'; // ← ĐÃ CÓ useNavigate
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

const Register = () => {
  const [form, setForm] = useState({ // ← ĐÃ KHAI BÁO
    cccd: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { user, register } = useAuth();
  const navigate = useNavigate();

  // TỰ ĐỘNG CHUYỂN NẾU ĐÃ LOGIN
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => { // ← ĐÃ KHAI BÁO
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => { // ← ĐÃ KHAI BÁO
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    register({
      name: form.fullName,
      cccd: form.cccd,
      email: form.email
    });
    navigate('/');
  };

  return (
    <AuthLayout title="Đăng ký tài khoản">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="cccd"
          placeholder="Căn cước công dân"
          value={form.cccd}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg text-sm"
          required
        />
        <input
          type="text"
          name="fullName"
          placeholder="Họ và tên"
          value={form.fullName}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg text-sm"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg text-sm"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg text-sm"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Xác nhận mật khẩu"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg text-sm"
          required
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition"
        >
          Đăng ký
        </button>
        <p className="text-center text-xs text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-red-600 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;