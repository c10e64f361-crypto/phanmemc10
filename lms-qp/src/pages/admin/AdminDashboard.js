// src/pages/admin/AdminDashboard.js
import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Book, Users, Award, Clock, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { label: 'Tổng khóa học', value: '24', icon: Book, color: 'bg-blue-100 text-blue-700', change: '+12%' },
    { label: 'Người dùng', value: '1,256', icon: Users, color: 'bg-green-100 text-green-700', change: '+5%' },
    { label: 'Chứng chỉ đã cấp', value: '489', icon: Award, color: 'bg-yellow-100 text-yellow-700', change: '+18%' },
    { label: 'Ca thi hôm nay', value: '8', icon: Clock, color: 'bg-orange-100 text-orange-700', change: '0%' },
  ];

  return (
    <AdminLayout title="Dashboard Quản trị">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Khóa học mới: An ninh mạng</span><span className="text-gray-500">2 giờ trước</span></div>
            <div className="flex justify-between"><span>Chứng chỉ cấp cho Nguyễn Văn A</span><span className="text-gray-500">4 giờ trước</span></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Thông báo hệ thống</h3>
          <p className="text-sm text-amber-600">Hệ thống sẽ bảo trì lúc 2:00 AM</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;