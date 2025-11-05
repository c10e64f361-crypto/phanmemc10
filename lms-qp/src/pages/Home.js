// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BookOpen, Clock, Users, Star, AlertCircle, ArrowRight, Award } from 'lucide-react';

// Skeleton Card
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-52 bg-gray-200"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="flex justify-between mt-4">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ featured: [], categories: [], recent: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập');
      setLoading(false);
      return;
    }

    axios.get(`${API_URL}/api/home`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setData(res.data.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Lỗi tải trang chủ:', err);
      setError('Không thể tải dữ liệu');
      setLoading(false);
    });
  }, []);

  // ĐIỀU HƯỚNG
  const goToCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const goToCategory = (level) => {
    navigate(`/courses?level=${encodeURIComponent(level)}`);
  };

  const goToContinueLearning = (courseId) => {
    navigate(`/course/${courseId}/learn`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Hero Skeleton */}
          <div className="bg-white rounded-3xl shadow-lg p-16 mb-16 animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>

          {/* Categories Skeleton */}
          <div className="mb-16">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <div className="h-5 bg-gray-200 rounded mx-auto w-20"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Courses Skeleton */}
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-800 mb-2">Oops!</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      {/* HERO BANNER */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Học tập không giới hạn
              <span className="block text-yellow-300">với LMS Quốc Phòng</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Hơn 50 khóa học chất lượng cao, giảng viên hàng đầu, chứng chỉ uy tín
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/courses')}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition"
              >
                Bắt đầu học ngay
              </button>
              <button 
                onClick={() => navigate('/courses')}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition"
              >
                Xem khóa học
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DANH MỤC - BẤM ĐƯỢC */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Khám phá theo lĩnh vực</h2>
            <p className="text-gray-600">Chọn lĩnh vực bạn yêu thích để bắt đầu hành trình</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.categories.length === 0 ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-50 p-8 rounded-2xl text-center border-2 border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <p className="text-sm text-gray-500">Đang tải...</p>
                </div>
              ))
            ) : (
              data.categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => goToCategory(cat.name)}
                  className="group bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl text-center hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer border border-blue-100 w-full"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center transform group-hover:scale-110 transition">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">{cat.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{cat.course_count} khóa học</p>
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* KHÓA HỌC NỔI BẬT */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Khóa học nổi bật</h2>
            <p className="text-gray-600">Được hàng nghìn học viên tin chọn</p>
          </div>

          {data.featured.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-12 text-center">
              <Award className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <p className="text-lg text-yellow-800">Chưa có khóa học nổi bật</p>
              <p className="text-sm text-yellow-600 mt-2">Hãy đăng ký để khám phá!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.featured.map(course => (
                <div 
                  key={course.id} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2 cursor-pointer"
                  onClick={() => goToCourse(course.id)}
                >
                  <div className="relative">
                    <img 
                      src={course.thumbnail || '/placeholder-course.jpg'} 
                      alt={course.title}
                      className="w-full h-52 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      HOT
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description || 'Khóa học chất lượng cao với nội dung thực tế'}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        {course.enrolled_count} học viên
                      </span>
                      <span className="flex items-center gap-1 text-yellow-600 font-bold">
                        <Star className="w-4 h-4 fill-current" />
                        4.8
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TIẾP TỤC HỌC */}
      {data.recent.length > 0 && (
        <section className="py-20 bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Tiếp tục hành trình học tập</h2>
              <p className="text-gray-600">Bạn đang học dở những khóa nào?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.recent.map(course => {
                const chapters = course.chapters_completed || [];
                const completed = Array.isArray(chapters) ? chapters.length : 0;
                const percent = Math.round((completed / 5) * 100); // giả sử 5 chương

                return (
                  <div 
                    key={course.id} 
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
                    onClick={() => goToContinueLearning(course.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-800 line-clamp-2">{course.title}</h4>
                      <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Tiến độ</span>
                          <span className="font-bold text-blue-600">{percent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium text-blue-600">Tiếp tục học</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA CUỐI TRANG */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Sẵn sàng bắt đầu chưa?</h2>
          <p className="text-xl mb-8 opacity-90">Tham gia ngay hôm nay và nhận chứng chỉ uy tín!</p>
          <button 
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition"
          >
            Đăng ký miễn phí
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;