// src/pages/admin/Reports.js
import React, { useState } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Calendar, Users, BookOpen, Award, TrendingUp, Clock } from 'lucide-react';

const Reports = () => {
  const [filterMonth, setFilterMonth] = useState('10');
  const [filterYear] = useState('2025');

  // Dữ liệu mẫu
  const completionData = [
    { name: 'Công nghệ số', completed: 78, total: 100 },
    { name: 'AI ứng dụng', completed: 65, total: 80 },
    { name: 'An ninh mạng', completed: 90, total: 120 },
    { name: 'Chuyển đổi số', completed: 55, total: 90 },
  ];

  const examPassRate = [
    { name: 'Đậu', value: 72, color: '#10b981' },
    { name: 'Rớt', value: 28, color: '#ef4444' }
  ];

  const avgScoreData = [
    { month: 'Tháng 6', score: 72 },
    { month: 'Tháng 7', score: 75 },
    { month: 'Tháng 8', score: 78 },
    { month: 'Tháng 9', score: 80 },
    { month: 'Tháng 10', score: 82 },
  ];

  const stats = {
    totalUsers: 1250,
    activeThisMonth: 890,
    coursesCompleted: 342,
    examsTaken: 156,
    avgScore: 81.5,
    passRate: 72
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Báo cáo & Thống kê</h1>
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-600" />
          <select
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            {['01','02','03','04','05','06','07','08','09','10','11','12'].map(m => (
              <option key={m} value={m}>Tháng {parseInt(m)}</option>
            ))}
          </select>
          <span className="font-medium">{filterYear}</span>
        </div>
      </div>

      {/* Tổng quan - Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng học viên</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hoạt động tháng này</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeThisMonth}</p>
            </div>
            <Clock className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Khóa học hoàn thành</p>
              <p className="text-2xl font-bold text-purple-600">{stats.coursesCompleted}</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kỳ thi đã tổ chức</p>
              <p className="text-2xl font-bold text-orange-600">{stats.examsTaken}</p>
            </div>
            <Award className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Điểm TB</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.avgScore}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tỷ lệ đậu</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.passRate}%</p>
            </div>
            <Award className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Tỷ lệ hoàn thành khóa học */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Tỷ lệ hoàn thành khóa học</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#3b82f6" name="Hoàn thành" />
              <Bar dataKey="total" fill="#e5e7eb" name="Tổng đăng ký" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Tỷ lệ đậu/rớt */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Tỷ lệ đậu/rớt kỳ thi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={examPassRate}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {examPassRate.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Điểm trung bình theo thời gian */}
        <div className="bg-white p-6 rounded-lg shadow-sm border lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Xu hướng điểm trung bình</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={avgScoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[60, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 6 }}
                name="Điểm trung bình"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;