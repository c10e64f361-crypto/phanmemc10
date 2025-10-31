// src/pages/admin/ManageCourses.js
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import CourseForm from '../../components/admin/CourseForm';
import { Edit, Trash2, Search, Plus } from 'lucide-react';

const ManageCourses = () => {
  const [courses, setCourses] = useState([
    { id: 1, code: 'BDHVS-01', name: 'Binh dân học vụ số 1', status: 'Hoạt động', students: 120 },
    { id: 2, code: 'ANNM-01', name: 'An ninh mạng cơ bản', status: 'Tạm dừng', students: 45 },
  ]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = courses.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase()) || 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data) => {
    if (editing) {
      setCourses(courses.map(c => c.id === editing.id ? { ...c, ...data } : c));
    } else {
      setCourses([...courses, { id: Date.now(), students: 0, ...data }]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Xóa khóa học này?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  return (
    <AdminLayout title="Quản lý khóa học">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm khóa học..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Thêm khóa học
        </button>
      </div>

      {showForm && (
        <CourseForm
          course={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Mã</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tên khóa học</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Học viên</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(course => (
              <tr key={course.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm">{course.code}</td>
                <td className="px-6 py-4">{course.name}</td>
                <td className="px-6 py-4 text-center">{course.students}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.status === 'Hoạt động' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {course.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => { setEditing(course); setShowForm(true); }} className="text-blue-600 hover:text-blue-800 mr-3">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ManageCourses;