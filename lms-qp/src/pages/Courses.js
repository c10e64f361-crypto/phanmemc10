// src/pages/Courses.js
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseSidebar from '../components/CourseSidebar';
import CourseCard from '../components/CourseCard';
import axios from 'axios';
import { ChevronRight } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/courses`, {
        params: { search, tag: selectedTag },
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data.data);
    } catch (err) {
      console.error('Lỗi tải khóa học:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search, selectedTag]);

  // Nhóm theo category
  const groupedCourses = courses.reduce((acc, course) => {
    const cat = course.category_title || 'Khác';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(course);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Tìm kiếm theo từ khóa"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500"
            />
            <button 
              onClick={fetchCourses}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80">
            <CourseSidebar 
              selectedTag={selectedTag} 
              onTagSelect={(tag) => {
                setSelectedTag(tag);
                setSearch(''); // Xóa search khi lọc tag
              }} 
            />
          </div>
          <div className="flex-1 space-y-10">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : Object.keys(groupedCourses).length === 0 ? (
              <p className="text-center text-gray-500 py-12">Không tìm thấy khóa học nào.</p>
            ) : (
              Object.entries(groupedCourses).map(([category, courses]) => (
                <section key={category}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-blue-900">{category}</h2>
                    <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                      Xem thêm <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {courses.map(course => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Courses;