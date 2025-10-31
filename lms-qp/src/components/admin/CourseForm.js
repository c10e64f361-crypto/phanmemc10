// src/components/admin/CourseForm.js
import React, { useState, useEffect } from 'react';

const CourseForm = ({ course, onSave, onCancel }) => {
  const [form, setForm] = useState({
    code: '',
    name: '',
    status: 'Hoạt động'
  });

  useEffect(() => {
    if (course) setForm(course);
  }, [course]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {course ? 'Sửa khóa học' : 'Thêm khóa học mới'}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Mã khóa học</label>
          <input
            type="text"
            value={form.code}
            onChange={e => setForm({ ...form, code: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Tên khóa học</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Trạng thái</label>
          <select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option>Hoạt động</option>
            <option>Tạm dừng</option>
          </select>
        </div>
        <div className="md:col-span-3 flex gap-3">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Lưu
          </button>
          <button type="button" onClick={onCancel} className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400">
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;