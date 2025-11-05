// src/pages/admin/CreateExam.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, ArrowLeft } from 'lucide-react';

const CreateExam = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    duration: 120,
    max_attempts: 1,
    scoring_method: 'Cao nhất'
  });
  const [errors, setErrors] = useState({});

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Tên kỳ thi không được để trống';
    if (!form.start_time) newErrors.start_time = 'Chọn thời gian bắt đầu';
    if (!form.end_time) newErrors.end_time = 'Chọn thời gian kết thúc';
    if (new Date(form.end_time) <= new Date(form.start_time)) {
      newErrors.end_time = 'Thời gian kết thúc phải sau thời gian bắt đầu';
    }
    if (form.duration < 30) newErrors.duration = 'Thời lượng ít nhất 30 phút';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_URL}/api/exams`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Tạo kỳ thi thành công!');
      navigate('/admin/exams');
    } catch (err) {
      alert('Tạo kỳ thi thất bại');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-blue-900 mb-8">Tạo kỳ thi mới</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* TÊN KỲ THI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên kỳ thi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="VD: Kỳ thi chuyển đổi số 2025"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* MÔ TẢ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="Mô tả ngắn về kỳ thi..."
              />
            </div>

            {/* THỜI GIAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Thời gian bắt đầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={form.start_time}
                  onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.start_time ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.start_time && <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian kết thúc <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={form.end_time}
                  onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.end_time ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.end_time && <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>}
              </div>
            </div>

            {/* THỜI LƯỢNG + SỐ LẦN THI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Thời lượng (phút) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  min="30"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.duration ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline w-4 h-4 mr-1" />
                  Số lần thi tối đa
                </label>
                <input
                  type="number"
                  value={form.max_attempts}
                  onChange={(e) => setForm({ ...form, max_attempts: e.target.value })}
                  min="1"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                />
              </div>
            </div>

            {/* PHƯƠNG THỨC CHẤM */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phương thức chấm điểm
              </label>
              <select
                value={form.scoring_method}
                onChange={(e) => setForm({ ...form, scoring_method: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
              >
                <option value="Cao nhất">Cao nhất</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Cuối cùng">Cuối cùng</option>
              </select>
            </div>

            {/* NÚT */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Tạo kỳ thi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateExam;