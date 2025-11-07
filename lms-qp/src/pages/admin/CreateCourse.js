// src/pages/admin/CreateCourse.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [form, setForm] = useState({
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

  // LẤY DANH MỤC
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_URL}/api/categories`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setCategories(res.data.data);
      setLoadingCategories(false);
    })
    .catch(err => {
      console.error('Lỗi tải danh mục:', err);
      setLoadingCategories(false);
    });
  }, []);

  // TỰ ĐỘNG SINH MÃ KHÓA HỌC KHI CHỌN DANH MỤC
  useEffect(() => {
    if (form.category_id) {
      const selectedCat = categories.find(cat => cat.id == form.category_id);
      if (selectedCat) {
        // Prefix: 3 chữ cái đầu của danh mục (viết hoa, không dấu)
        const prefix = selectedCat.title
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase()
          .replace(/[^A-Z]/g, '')
          .substring(0, 3) || 'KH';

        // Đếm số khóa học hiện có trong danh mục này (gọi API đếm)
        const countCourses = async () => {
          try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/api/courses`, {
              headers: { Authorization: `Bearer ${token}` },
              params: { category_id: form.category_id, limit: 1 }
            });
            const count = res.data.total || 0;
            const code = `${prefix}${String(count + 1).padStart(2, '0')}`;
            setForm(prev => ({ ...prev, code }));
          } catch (err) {
            console.error('Lỗi đếm khóa học:', err);
            setForm(prev => ({ ...prev, code: `${prefix}01` })); // Fallback
          }
        };

        countCourses();
      }
    }
  }, [form.category_id, categories]);

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
    if (!form.category_id) {
      alert('Vui lòng chọn danh mục khóa học');
      return;
    }

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
        {/* DANH MỤC + MÃ KHÓA HỌC (TỰ ĐỘNG) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Danh mục khóa học</label>
            {loadingCategories ? (
              <div className="w-full px-3 py-2 border rounded bg-gray-50 text-gray-500">
                Đang tải...
              </div>
            ) : (
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mã khóa học (tự động)</label>
            <input
              type="text"
              value={form.code}
              readOnly
              className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-700 cursor-not-allowed"
              placeholder="Sẽ tự động sinh sau khi chọn danh mục"
            />
          </div>
        </div>

        {/* TÊN KHÓA HỌC */}
        <div>
          <label className="block text-sm font-medium mb-1">Tên khóa học</label>
          <input 
            name="title" 
            value={form.title} 
            onChange={handleChange} 
            required 
            className="w-full px-3 py-2 border rounded" 
          />
        </div>

        {/* MÔ TẢ */}
        <div>
          <label className="block text-sm font-medium mb-1">Mô tả</label>
          <textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            rows="3" 
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* GIẢNG VIÊN & THỜI LƯỢNG */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Giảng viên</label>
            <input 
              name="instructor" 
              value={form.instructor} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border rounded" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thời lượng (giờ)</label>
            <input 
              type="number" 
              name="duration" 
              value={form.duration} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border rounded" 
            />
          </div>
        </div>

        {/* CẤP ĐỘ & NGÀY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cấp độ</label>
            <select 
              name="level" 
              value={form.level} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded"
            >
              <option>Cơ bản</option>
              <option>Nâng cao</option>
              <option>Chuyên sâu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
            <input 
              type="date" 
              name="start_date" 
              value={form.start_date} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border rounded" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
            <input 
              type="date" 
              name="end_date" 
              value={form.end_date} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border rounded" 
            />
          </div>
        </div>

        {/* GIÁ & TAG */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Giá (VNĐ)</label>
            <input 
              type="number" 
              name="price" 
              value={form.price} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tag</label>
            <input 
              name="tag" 
              value={form.tag} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded" 
              placeholder="toán, lập trình, AI"
            />
          </div>
        </div>

        {/* ẢNH ĐẠI DIỆN */}
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

        {/* NÚT TẠO */}
        <button
          type="submit"
          disabled={loading || !form.code}
          className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
            loading || !form.code
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {loading ? 'Đang tạo...' : 'Tạo khóa học'}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;