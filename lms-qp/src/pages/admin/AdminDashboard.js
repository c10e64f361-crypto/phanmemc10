// src/pages/admin/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Trophy, Award, Clock, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [overview, setOverview] = useState({});
  const [completionData, setCompletionData] = useState([]);
  const [avgScoreData, setAvgScoreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completionFilter, setCompletionFilter] = useState('month');
  const [scoreFilter, setScoreFilter] = useState('month');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const [overviewRes, completionRes, scoreRes] = await Promise.all([
          axios.get(`${API_URL}/api/dashboard/overview`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/api/learning/chart/completion?filter=${completionFilter}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/api/learning/chart/avg-score?filter=${scoreFilter}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setOverview(overviewRes.data.data);
        setCompletionData(completionRes.data.data);
        setAvgScoreData(scoreRes.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi tải dashboard:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [completionFilter, scoreFilter]);

  const formatXAxis = (value, filter) => {
    if (filter === 'week') return `Tuần ${value.split('-')[1]}`;
    if (filter === 'month') return value;
    return value;
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* TITLE */}
        <h1 className="text-3xl font-bold text-blue-900 mb-8 flex items-center gap-3">
          <TrendingUp className="w-10 h-10" />
          Dashboard Quản trị
        </h1>

        {/* THỐNG KÊ TỔNG QUAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-10 h-10 text-blue-600" />
              <span className="text-3xl font-bold text-blue-900">{overview.totalUsers || 0}</span>
            </div>
            <p className="text-gray-600">Tổng học viên</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <div className="flex items-center justify-between mb-3">
              <Trophy className="w-10 h-10 text-green-600" />
              <span className="text-3xl font-bold text-green-700">{overview.completedCourses || 0}</span>
            </div>
            <p className="text-gray-600">Khóa học hoàn thành</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-10 h-10 text-purple-600" />
              <span className="text-3xl font-bold text-purple-700">{overview.avgCompletion || 0}%</span>
            </div>
            <p className="text-gray-600">Tỷ lệ hoàn thành TB</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-10 h-10 text-orange-600" />
              <span className="text-3xl font-bold text-orange-700">{overview.certificateUsers || 0}</span>
            </div>
            <p className="text-gray-600">Chứng chỉ đã cấp</p>
          </div>
        </div>

        {/* BIỂU ĐỒ HOÀN THÀNH */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-900">
                Học viên hoàn thành khóa học
              </h2>
              <select
                value={completionFilter}
                onChange={(e) => setCompletionFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Tuần</option>
                <option value="month">Tháng</option>
                <option value="year">Năm</option>
              </select>
            </div>
            {completionData.length === 0 ? (
              <p className="text-center text-gray-600 py-16">Chưa có dữ liệu</p>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={completionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" tickFormatter={(v) => formatXAxis(v, completionFilter)} stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip labelFormatter={(v) => formatXAxis(v, completionFilter)} />
                  <Legend />
                  <Line type="monotone" dataKey="completed_users" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-900">
                Điểm trung bình theo thời gian
              </h2>
              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Tuần</option>
                <option value="month">Tháng</option>
                <option value="year">Năm</option>
              </select>
            </div>
            {avgScoreData.length === 0 ? (
              <p className="text-center text-gray-600 py-16">Chưa có dữ liệu</p>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={avgScoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" tickFormatter={(v) => formatXAxis(v, scoreFilter)} stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip formatter={(value) => `${Math.round(value)}%`} />
                  <Legend />
                  <Line type="monotone" dataKey="avg_score" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* THỐNG KÊ CHI TIẾT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Học viên theo quyền</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Quản trị viên</span>
                <span className="text-blue-700 font-bold">1</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium">Giáo viên</span>
                <span className="text-green-700 font-bold">2</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium">Học viên</span>
                <span className="text-purple-700 font-bold">10</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Khóa học phổ biến</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Chuyển đổi số</span>
                <span className="text-blue-700 font-bold">45</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium">AI cơ bản</span>
                <span className="text-green-700 font-bold">32</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium">An ninh mạng</span>
                <span className="text-purple-700 font-bold">28</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Cảnh báo</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="font-medium text-red-800">3 học viên chưa hoạt động</span>
                <span className="text-red-700 font-bold">Cảnh báo</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium text-yellow-800">5 khóa học sắp hết hạn</span>
                <span className="text-yellow-700 font-bold">Kiểm tra</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;