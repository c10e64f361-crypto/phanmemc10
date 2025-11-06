// src/pages/MyCourses.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Search, Calendar, Filter, Loader2, AlertCircle } from 'lucide-react';

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
    <td className="px-4 py-3 text-center"><div className="h-6 bg-gray-200 rounded-full w-20 mx-auto"></div></td>
    <td className="px-4 py-3 text-center"><div className="h-8 bg-gray-200 rounded w-20 mx-auto"></div></td>
  </tr>
);

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const params = {
        page: currentPage,
        limit,
        search: search || undefined,
        year: year || undefined,
        status: status || undefined
      };

      const res = await axios.get(`${API_URL}/api/learning/my-courses`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      setCourses(res.data.data.courses);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      setError('Không thể tải danh sách khóa học');
      console.error('Lỗi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, limit, search, year, status]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCourses();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Search & Filter */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Từ khóa</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm khóa học..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Năm</label>
              <select 
                value={year} 
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Trạng thái</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="Đang học">Đang học</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Hiển thị</label>
              <select 
                value={limit} 
                onChange={(e) => { setLimit(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div>
              <button 
                onClick={handleSearch}
                className="w-full bg-blue-900 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center justify-center gap-1 hover:bg-blue-800 transition"
              >
                <Filter className="w-4 h-4" />
                Lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
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
                {[...Array(limit)].map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </tbody>
            </table>
          ) : error ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gray-100 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-4"></div>
              <p className="text-gray-600">Bạn chưa tham gia khóa học nào</p>
            </div>
          ) : (
            <>
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
                  {courses.map((course, i) => (
                    <tr key={course.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{(currentPage - 1) * limit + i + 1}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{course.course_title}</p>
                          <p className="text-xs text-gray-500">Mã: {course.course_code}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(course.start_date).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          course.status === 'Hoàn thành' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          onClick={() => window.location.href = `/course/${course.course_id}/learn`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Vào học
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-4 py-3 bg-gray-50 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    First
                  </button>
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-8 h-8 rounded font-medium ${
                        currentPage === i + 1 
                          ? 'bg-blue-900 text-white' 
                          : 'hover:bg-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="text-gray-600">
                  Trang {currentPage} / {totalPages}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyCourses;