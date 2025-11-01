// src/components/AdminRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user } = useAuth();

  // Nếu chưa login → về login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu không phải Admin → về trang chủ
  if (user.role !== 'Quản trị viên') {
    return <Navigate to="/" replace />;
  }

  // OK → cho vào Admin
  return <Outlet />;
};

export default AdminRoute;