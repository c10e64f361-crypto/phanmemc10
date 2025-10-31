// src/layouts/AdminLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar cố định */}
      <AdminSidebar />

      {/* Nội dung chính - thay đổi theo route */}
      <div className="flex-1 ml-64">
        <div className="p-6">
          <Outlet /> {/* ← Nội dung các trang admin sẽ hiện ở đây */}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;