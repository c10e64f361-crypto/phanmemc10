// src/pages/admin/ManageCourses.js
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import CourseForm from '../../components/admin/CourseForm';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';

const ManageCourses = () => {
  const [courses, setCourses] = useState([
    { id: 1, code: 'BDHVS-01', title: 'Binh dân học vụ số 1', instructor: 'TS. Nguyễn Văn A', duration: '20 giờ', status: 'Hoạt động', students: 1247 },
    { id: 2, code: 'ANNM-01', title: 'An ninh mạng cơ bản', instructor: 'TS. Trần Thị B', duration: '15 giờ', status: 'Tạm dừng', students: 456 },
    { id: 3, code: 'KTCD-01', title: 'Chuyển đổi số', instructor: 'PGS.TS. Lê Văn C', duration: '25 giờ', status: 'Hoạt động', students: 789 },
  ]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const filteredCourses = courses.filter(course => 
    (course.title.toLowerCase().includes(search.toLowerCase()) ||
     course.code.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || course.status === statusFilter)
  );

  const handleSave = (data) => {
    if (editingCourse) {
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...data } : c));
    } else {
      setCourses([...courses, { id: Date.now(), students: 0, ...data }]);
    }
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Xóa khóa học này?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  return (
    <AdminLayout title="Quản lý khóa học">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc mã khóa học..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Tạm dừng">Tạm dừng</option>
          </select>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm khóa học
        </button>
      </div>

      {showForm && (
        <CourseForm
          course={editingCourse}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingCourse(null);
          }}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã KH</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên khóa học</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giảng viên</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thời lượng</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Học viên</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCourses.map(course => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="font-mono text-sm">{course.code}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">{course.title}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{course.instructor}</td>
                <td className="px-6 py-4 text-center">{course.duration}</td>
                <td className="px-6 py-4 text-center font-medium">{course.students}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.status === 'Hoạt động' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {course.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingCourse(course);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-800 p-1" title="Xem chi tiết">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCourses.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Không tìm thấy khóa học nào
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <span>Hiển thị {filteredCourses.length} khóa học</span>
        <div className="flex items-center gap-2">
          <span className="mr-2">Sắp xếp theo:</span>
          <select className="border rounded px-2 py-1">
            <option>Mới nhất</option>
            <option>Tên A-Z</option>
            <option>Số học viên</option>
          </select>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageCourses;