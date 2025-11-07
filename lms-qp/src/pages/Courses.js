// src/pages/Courses.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import { Search, ChevronLeft, ChevronRight, Loader2, FolderOpen } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [catSearch, setCatSearch] = useState('');
  const [catPage, setCatPage] = useState(1);
  const limit = 10;
  const catLimit = 8;

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // LẤY DANH MỤC
  useEffect(() => {
    axios.get(`${API_URL}/api/categories`)
      .then(res => {
        const all = [{ id: '', title: 'Tất cả danh mục' }];
        setCategories(all.concat(res.data.data));
        setLoadingCats(false);
      })
      .catch(() => setLoadingCats(false));
  }, []);

  // LỌC + TÌM KIẾM DANH MỤC
  const filteredCategories = categories
    .filter(cat => cat.title.toLowerCase().includes(catSearch.toLowerCase()))
    .slice((catPage - 1) * catLimit, catPage * catLimit);

  // LẤY KHÓA HỌC
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit, search };
      if (selectedCategory) params.category_id = selectedCategory;

      const res = await axios.get(`${API_URL}/api/courses`, { params });
      setCourses(res.data.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Lỗi tải khóa học:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, selectedCategory, search]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCourses();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      {/* Search Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <button 
              onClick={handleSearch}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-medium transition shadow-md"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar - Danh mục */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-xl p-6 border">
              <div className="flex items-center gap-3 mb-5">
                <FolderOpen className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-800">Chủ đề</h3>
              </div>

              {/* Tìm kiếm danh mục */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm chủ đề..."
                  value={catSearch}
                  onChange={(e) => {
                    setCatSearch(e.target.value);
                    setCatPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Danh sách danh mục */}
              {loadingCats ? (
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-11 bg-gray-100 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredCategories.map(cat => (
                    <button
                      key={cat.id || 'all'}
                      onClick={() => {
                        setSelectedCategory(cat.id || '');
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
                        selectedCategory === (cat.id || '')
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="w-2 h-2 bg-current rounded-full"></div>
                      {cat.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Phân trang danh mục */}
              {categories.length > catLimit && (
                <div className="flex justify-center items-center gap-2 mt-5">
                  <button
                    onClick={() => setCatPage(prev => Math.max(1, prev - 1))}
                    disabled={catPage === 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Trang {catPage} / {Math.ceil(categories.length / catLimit)}
                  </span>
                  <button
                    onClick={() => setCatPage(prev => Math.min(Math.ceil(categories.length / catLimit), prev + 1))}
                    disabled={catPage === Math.ceil(categories.length / catLimit)}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Danh sách khóa học */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow animate-pulse p-4">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow">
                <p className="text-gray-500 text-lg">Không tìm thấy khóa học nào</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {courses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>

                {/* Phân trang khóa học */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-12">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-3 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-11 h-11 rounded-xl font-medium transition ${
                            currentPage === i + 1
                              ? 'bg-red-600 text-white shadow-lg'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-3 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Courses;