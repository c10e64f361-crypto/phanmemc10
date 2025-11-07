// src/pages/admin/ExamEdit.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

const ExamEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    start_time: '',
    end_time: '',
    duration: '',
    max_attempts: 1,
    scoring_method: 'Cao nhất'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // LẤY DỮ LIỆU KỲ THI
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_URL}/api/exams/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const exam = res.data.data;
      setForm({
        title: exam.title || '',
        start_time: exam.start_time ? exam.start_time.slice(0, 16) : '',
        end_time: exam.end_time ? exam.end_time.slice(0, 16) : '',
        duration: exam.duration || '',
        max_attempts: exam.max_attempts || 1,
        scoring_method: exam.scoring_method || 'Cao nhất'
      });
      setLoading(false);
    })
    .catch(() => {
      alert('Lỗi tải kỳ thi');
      navigate('/admin/exams');
    });
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/exams/${id}`, form, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert('Cập nhật kỳ thi thành công!');
      navigate('/admin/exams');
    } catch (err) {
      console.error('Lỗi cập nhật:', err.response?.data || err);
      alert('Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:underline mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Quay lại
      </button>

      <h1 className="text-2xl font-bold text-blue-900 mb-6">Sửa kỳ thi</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        {/* TÊN KỲ THI */}
        <div>
          <label className="block text-sm font-medium mb-1">Tên kỳ thi</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Ví dụ: Kỳ thi chuyển đổi số 2025"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* THỜI GIAN BẮT ĐẦU & KẾT THÚC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-1 text-sm font-medium mb-1">
              <Calendar className="w-4 h-4" />
              Mở từ
            </label>
            <input
              type="datetime-local"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-medium mb-1">
              <Calendar className="w-4 h-4" />
              Mở đến
            </label>
            <input
              type="datetime-local"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* THỜI LƯỢNG & SỐ LẦN THI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-1 text-sm font-medium mb-1">
              <Clock className="w-4 h-4" />
              Thời lượng (phút)
            </label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              required
              placeholder="120"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Số lần thi tối đa</label>
            <input
              type="number"
              name="max_attempts"
              value={form.max_attempts}
              onChange={handleChange}
              min="1"
              max="10"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* PHƯƠNG THỨC CHẤM */}
        <div>
          <label className="block text-sm font-medium mb-1">Phương thức chấm</label>
          <select
            name="scoring_method"
            value={form.scoring_method}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Cao nhất">Cao nhất</option>
            <option value="Trung bình">Trung bình</option>
          </select>
        </div>

        {/* NÚT */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
              saving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {saving ? 'Đang lưu...' : 'Cập nhật kỳ thi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamEdit;