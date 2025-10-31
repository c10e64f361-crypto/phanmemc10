// src/pages/MyCourses.js
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseRow from '../components/CourseRow';
import { myCourses } from '../data/myCourseData';

const MyCourses = () => {
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');
  const [plan, setPlan] = useState('');
  const [status, setStatus] = useState('');

  const filteredCourses = myCourses.filter(course => {
    return (
      (!search || course.name.toLowerCase().includes(search.toLowerCase())) &&
      (!year || course.start.includes(year)) &&
      (!status || course.status === status)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Search & Filter */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Từ khóa</label>
              <input
                type="text"
                placeholder="Nhập từ khóa tìm kiếm"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Chọn năm</label>
              <select className="w-full px-3 py-2 border rounded-md text-sm">
                <option>Tất cả</option>
                <option>2025</option>
                <option>2026</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Chọn trạng thái kế hoạch</label>
              <select className="w-full px-3 py-2 border rounded-md text-sm">
                <option>Tất cả</option>
                <option>Kế hoạch A</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Chọn trạng thái</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">Tất cả</option>
                <option value="Đang học">Đang học</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>
            </div>
            <div>
              <button className="w-full bg-blue-900 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center justify-center gap-1">
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">STT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Lớp học</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Thời gian</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Trạng thái học</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course, i) => (
                <CourseRow key={course.id} course={course} index={i + 1} />
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-gray-200 rounded">First</button>
              <button className="w-8 h-8 bg-blue-900 text-white rounded flex items-center justify-center font-bold">1</button>
              <button className="p-1 hover:bg-gray-200 rounded">Next</button>
            </div>
            <div className="flex items-center gap-2">
              <span>Hiển thị</span>
              <select className="border rounded px-2 py-1">
                <option>10</option>
                <option>20</option>
              </select>
              <span>dòng</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyCourses;