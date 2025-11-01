// src/pages/admin/EditCourse.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';

const EditCourse = () => {
  const { id } = useParams();
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
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // LẤY DỮ LIỆU KHÓA HỌC
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_URL}/api/courses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const course = res.data.data;
      setForm({
        code: course.code || '',
        title: course.title || '',
        description: course.description || '',
        instructor: course.instructor || '',
        duration: course.duration || '',
        level: course.level || 'Cơ bản',
        start_date: course.start_date ? course.start_date.split('T')[0] : '',
        end_date: course.end_date ? course.end_date.split('T')[0] : '',
        price: course.price || 0,
        category_id: course.category_id || '',
        tag: course.tag || ''
      });
      setPreview(course.thumbnail ? `${API_URL}${course.thumbnail}` : '');
      setLoading(false);
    })
    .catch(err => {
      console.error('Lỗi tải khóa học:', err);
      alert('Không thể tải dữ liệu khóa học');
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/courses/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Cập nhật khóa học thành công!');
      navigate('/admin/courses');
    } catch (err) {
      console.error('Lỗi cập nhật:', err);
      alert('Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      {/* Nút quay lại */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:underline mb-6 text-sm font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Quay lại danh sách
      </button>

      <h1 className="text-2xl font-bold text-blue-900 mb-6">Sửa khóa học</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-5">
        {/* Mã + Tên */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã khóa học</label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên khóa học</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Giảng viên + Thời lượng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giảng viên</label>
            <input
              type="text"
              name="instructor"
              value={form.instructor}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời lượng (giờ)</label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Cấp độ + Ngày */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cấp độ</label>
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Cơ bản</option>
              <option>Nâng cao</option>
              <option>Chuyên sâu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Giá + Danh mục + Tag */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục ID</label>
            <input
              type="number"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
            <input
              type="text"
              name="tag"
              value={form.tag}
              onChange={handleChange}
              placeholder="VD: AI, Chuyển đổi số"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Upload ảnh */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded flex items-center gap-2 transition">
              <Upload className="w-5 h-5" />
              Chọn ảnh mới
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {preview && (
              <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded border" />
            )}
          </div>
        </div>

        {/* Nút submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Đang lưu...
              </>
            ) : (
              'Cập nhật khóa học'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCourse;