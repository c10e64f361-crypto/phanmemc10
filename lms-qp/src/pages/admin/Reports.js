// src/pages/admin/Reports.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Users, Trophy, Award, Clock, AlertCircle 
} from 'lucide-react';

const Reports = () => {
  const [completionData, setCompletionData] = useState([]);
  const [avgScoreData, setAvgScoreData] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    completedCourses: 0,
    avgCompletion: 0
  });
  const [loading, setLoading] = useState(true);
  const [completionFilter, setCompletionFilter] = useState('month');
  const [scoreFilter, setScoreFilter] = useState('month');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // LẤY DỮ LIỆU
  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const [completionRes, scoreRes, statsRes] = await Promise.all([
          axios.get(`${API_URL}/api/learning/chart/completion?filter=${completionFilter}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/api/learning/chart/avg-score?filter=${scoreFilter}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/api/reports/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => ({ data: { data: { totalUsers: 0, activeUsers: 0, completedCourses: 0, avgCompletion: 0 } } })) // XỬ LÝ LỖI
        ]);

        setCompletionData(completionRes.data.data);
        setAvgScoreData(scoreRes.data.data);
        setStats(statsRes.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi tải báo cáo:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [completionFilter, scoreFilter]);

  // ĐỊNH DẠNG TRỤC X
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
          <p className="text-gray-600">Đang tải báo cáo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* TIÊU ĐỀ */}
        <h1 className="text-3xl font-bold text-blue-900 mb-8 flex items-center gap-3">
          <TrendingUp className="w-10 h-10" />
          Báo cáo hệ thống
        </h1>

        {/* THỐNG KÊ TỔNG QUAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-10 h-10 text-blue-600" />
              <span className="text-3xl font-bold text-blue-900">{stats.totalUsers}</span>
            </div>
            <p className="text-gray-600">Tổng học viên</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <div className="flex items-center justify-between mb-3">
              <Trophy className="w-10 h-10 text-green-600" />
              <span className="text-3xl font-bold text-green-700">{stats.completedCourses}</span>
            </div>
            <p className="text-gray-600">Khóa học hoàn thành</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-10 h-10 text-purple-600" />
              <span className="text-3xl font-bold text-purple-700">{stats.avgCompletion}%</span>
            </div>
            <p className="text-gray-600">Tỷ lệ hoàn thành TB</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-10 h-10 text-orange-600" />
              <span className="text-3xl font-bold text-orange-700">+12%</span>
            </div>
            <p className="text-gray-600">Tăng trưởng tháng</p>
          </div>
        </div>

        {/* BIỂU ĐỒ HOÀN THÀNH */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-blue-900">
              Học viên hoàn thành khóa học
            </h2>
            <select
              value={completionFilter}
              onChange={(e) => setCompletionFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
          </div>

          {completionData.length === 0 ? (
            <p className="text-center text-gray-600 py-16">Chưa có dữ liệu hoàn thành</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="period" 
                  tickFormatter={(v) => formatXAxis(v, completionFilter)}
                  stroke="#6b7280"
                />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  labelFormatter={(v) => formatXAxis(v, completionFilter)}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="completed_users" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Học viên hoàn thành"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* BIỂU ĐỒ ĐIỂM TRUNG BÌNH */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-blue-900">
              Điểm trung bình theo thời gian
            </h2>
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
          </div>

          {avgScoreData.length === 0 ? (
            <p className="text-center text-gray-600 py-16">Chưa có dữ liệu điểm</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={avgScoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="period" 
                  tickFormatter={(v) => formatXAxis(v, scoreFilter)}
                  stroke="#6b7280"
                />
                <YAxis domain={[0, 100]} stroke="#6b7280" />
                <Tooltip 
                  formatter={(value) => `${Math.round(value)}%`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  labelFormatter={(v) => formatXAxis(v, scoreFilter)}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="avg_score" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Điểm trung bình"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;