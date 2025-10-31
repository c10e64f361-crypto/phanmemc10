// src/pages/admin/CoursesList.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { adminCourses } from '../../data/adminCourses';
import { Plus, Edit, Trash2, Film, Clock, BookOpen,FileText } from 'lucide-react';

const CoursesList = () => {
  const [courses, setCourses] = useState(adminCourses);
  const [showDelete, setShowDelete] = useState(null);

  const handleDelete = (id) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    setShowDelete(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Quản lý khóa học</h1>
        <Link
          to="/admin/courses/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Tạo khóa học mới
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{course.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {course.chapters.length} chương
                </div>
              </div>

              <div className="flex gap-2">
            
<Link
  to={`/admin/courses/${course.id}/chapters`}
  className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm"
>
  <Film className="w-4 h-4" />
  Quản lý chương
</Link>
<Link
  to={`/admin/courses/${course.id}/exercises`}
  className="flex-1 flex items-center justify-center gap-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 text-sm"
>
  <FileText className="w-4 h-4" />
  Bài tập
</Link>
                <Link
                  to={`/admin/courses/${course.id}/edit`}
                  className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setShowDelete(course.id)}
                  className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Xác nhận xóa */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-3">Xác nhận xóa</h3>
            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn xóa khóa học này?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(null)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(showDelete)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesList;