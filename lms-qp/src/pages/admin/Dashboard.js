// src/pages/admin/Dashboard.js
import React from 'react';
import { BookOpen, Users, Award, BarChart3, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Tổng khóa học', value: 24, icon: BookOpen, color: 'blue' },
    { label: 'Học viên', value: 1250, icon: Users, color: 'green' },
    { label: 'Chứng chỉ cấp', value: 342, icon: Award, color: 'purple' },
    { label: 'Tỷ lệ hoàn thành', value: '78%', icon: TrendingUp, color: 'yellow' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
          <div className="space-y-3 text-sm">
            <p className="flex justify-between"><span>Học viên Nguyễn Văn A hoàn thành khóa học</span><span className="text-gray-500">2 giờ trước</span></p>
            <p className="flex justify-between"><span>5 học viên đăng ký kỳ thi</span><span className="text-gray-500">4 giờ trước</span></p>
            <p className="flex justify-between"><span>Chứng chỉ mới được cấp</span><span className="text-gray-500">6 giờ trước</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Thông báo</h3>
          <div className="space-y-3 text-sm">
            <p className="text-orange-600">Kỳ thi "An ninh mạng" sẽ diễn ra vào 15/11</p>
            <p className="text-blue-600">Khóa học mới: "AI trong quốc phòng"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;