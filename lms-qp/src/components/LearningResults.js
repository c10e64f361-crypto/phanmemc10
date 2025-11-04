// src/components/LearningResults.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Target, CheckCircle } from 'lucide-react';

const LearningResults = ({ courseId }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_URL}/api/courses/${courseId}/learning/results`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setResults(res.data.data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, [courseId]);

  if (loading) return <div className="text-center py-8">Đang tải...</div>;

  return (
    <div className="space-y-6">
      {/* ĐIỂM BÀI TẬP */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Kết quả bài tập
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <p className="text-3xl font-bold text-blue-700">{results.quiz_score}%</p>
            <p className="text-sm text-gray-600">Điểm trung bình</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <p className="text-3xl font-bold text-green-700">{results.quiz_correct}/{results.quiz_total}</p>
            <p className="text-sm text-gray-600">Câu đúng</p>
          </div>
        </div>
      </div>

      {/* TIẾN ĐỘ HỌC */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Tiến độ học tập
        </h3>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Hoàn thành chương</span>
            <span className="text-sm">{results.completed_chapters} / {results.total_chapters}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-600 h-3 rounded-full transition-all"
              style={{ width: `${results.completion_percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* BADGE */}
      {results.badge && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-lg text-white text-center">
          <Trophy className="w-12 h-12 mx-auto mb-2" />
          <p className="text-xl font-bold">Chúc mừng!</p>
          <p className="text-lg">Bạn đã nhận: <strong>{results.badge}</strong></p>
        </div>
      )}
    </div>
  );
};

export default LearningResults;