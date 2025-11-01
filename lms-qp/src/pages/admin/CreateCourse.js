// src/pages/admin/CreateCourse.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    code: '',
    title: '',
    description: '',
    instructor: '',
    duration: '',
    level: 'Cơ bản',
    start_date: '',
    end_date: '',
    price: 0,
    category_id: '',
    tag: ''
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });
    if (thumbnail) formData.append('thumbnail', thumbnail);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/courses`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Tạo khóa học thành công!');
      navigate('/admin/courses');
    } catch (err) {
      alert('Lỗi tạo khóa học');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:underline mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Quay lại
      </button>

      <h1 className="text-2xl font-bold text-blue-900 mb-6">Tạo khóa học mới</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Mã khóa học</label>
            <input name="code" value={form.code} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tên khóa học</label>
            <input name="title" value={form.title} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mô tả</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="w-full px-3 py-2 border rounded"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Giảng viên</label>
            <input name="instructor" value={form.instructor} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thời lượng (giờ)</label>
            <input type="number" name="duration" value={form.duration} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cấp độ</label>
            <select name="level" value={form.level} onChange={handleChange} className="w-full px-3 py-2 border rounded">
              <option>Cơ bản</option>
              <option>Nâng cao</option>
              <option>Chuyên sâu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
            <input type="date" name="start_date" value={form.start_date} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
            <input type="date" name="end_date" value={form.end_date} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Giá (VNĐ)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Danh mục ID</label>
            <input type="number" name="category_id" value={form.category_id} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tag</label>
            <input name="tag" value={form.tag} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ảnh đại diện</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Chọn ảnh
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            {preview && <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded" />}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
        >
          {loading ? 'Đang tạo...' : 'Tạo khóa học'}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;