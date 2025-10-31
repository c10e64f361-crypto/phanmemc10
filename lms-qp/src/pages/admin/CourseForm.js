// src/components/admin/CourseForm.js
import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

const CourseForm = ({ course, onSave, onCancel }) => {
  const [form, setForm] = useState({
    code: '',
    title: '',
    instructor: '',
    duration: '',
    status: 'Hoạt động',
    image: null
  });

  useEffect(() => {
    if (course) setForm(course);
  }, [course]);

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {course ? 'Sửa khóa học' : 'Thêm khóa học mới'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Mã khóa học *</label>
              <input
                type="text"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tên khóa học *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Giảng viên *</label>
              <input
                type="text"
                value={form.instructor}
                onChange={e => setForm({ ...form, instructor: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Thời lượng</label>
              <input
                type="text"
                value={form.duration}
                onChange={e => setForm({ ...form, duration: e.target.value })}
                placeholder="VD: 20 giờ"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Trạng thái *</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option>Hoạt động</option>
                <option>Tạm dừng</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hình ảnh khóa học</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageUpload"
                />
                <label htmlFor="imageUpload" className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                  <Upload className="w-4 h-4" />
                  Chọn hình ảnh
                </label>
                {form.image && (
                  <span className="text-sm text-gray-600">{form.image.name}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;