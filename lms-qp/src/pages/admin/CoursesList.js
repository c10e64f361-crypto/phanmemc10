// src/pages/admin/CoursesList.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Film, FileText, Bell, X, Check, 
  Loader2, ChevronLeft, ChevronRight, Clock, Users, Search 
} from 'lucide-react';

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="flex gap-2 mt-4">
        <div className="h-8 bg-gray-200 rounded flex-1"></div>
        <div className="h-8 bg-gray-200 rounded flex-1"></div>
      </div>
    </div>
  </div>
);

const CoursesList = () => {
  const navigate = useNavigate();

  // === DỮ LIỆU & TRẠNG THÁI ===
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);

  // === PHÂN TRANG & LỌC & TÌM KIẾM ===
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const limit = 10;

  // === MODAL ===
  const [showDelete, setShowDelete] = useState(null);
  const [showNotify, setShowNotify] = useState(null);
  const [showQuiz, setShowQuiz] = useState(null);

  // === FORM ===
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyContent, setNotifyContent] = useState('');
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizOptions, setQuizOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('A');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // LẤY DANH MỤC
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_URL}/api/categories`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setCategories([{ id: '', title: 'Tất cả danh mục' }, ...res.data.data]);
      setLoadingCats(false);
    })
    .catch(() => setLoadingCats(false));
  }, []);

  // LẤY KHÓA HỌC
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = { page: currentPage, limit };
      if (selectedCategory) params.category_id = selectedCategory;
      if (search) params.search = search;

      const res = await axios.get(`${API_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      setCourses(res.data.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Lỗi tải khóa học:', err);
      alert('Không thể tải danh sách');
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, search]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // XÓA
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCourses();
      setShowDelete(null);
    } catch (err) {
      alert('Xóa thất bại');
    }
  };

  // GỬI THÔNG BÁO
  const handleSendNotify = (courseId) => {
    setShowNotify(courseId);
    setNotifyTitle('');
    setNotifyContent('');
  };

  const sendNotify = async () => {
    if (!notifyTitle.trim() || !notifyContent.trim()) {
      alert('Vui lòng nhập đầy đủ');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/courses/${showNotify}/announcements`, {
        title: notifyTitle,
        content: notifyContent
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Gửi thành công!');
      setShowNotify(null);
    } catch (err) {
      alert('Gửi thất bại');
    }
  };

  // TẠO BÀI TẬP
  const handleQuiz = (courseId) => {
    setShowQuiz(courseId);
    setQuizQuestion('');
    setQuizOptions(['', '', '', '']);
    setCorrectAnswer('A');
  };

  const createQuiz = async () => {
    if (!quizQuestion.trim() || quizOptions.some(opt => !opt.trim())) {
      alert('Vui lòng nhập đầy đủ');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/courses/${showQuiz}/questions`, {
        title: quizQuestion,
        options: quizOptions,
        correct_answer: correctAnswer
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Tạo thành công!');
      setShowQuiz(null);
    } catch (err) {
      alert('Tạo thất bại');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER + TÌM KIẾM + LỌC */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Quản lý khóa học</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Ô TÌM KIẾM */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm mã, tên khóa học..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
          </div>

          {/* LỌC DANH MỤC */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            disabled={loadingCats}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.title}</option>
            ))}
          </select>

          <Link
            to="/admin/courses/create"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            Tạo khóa học
          </Link>
        </div>
      </div>

      {/* DANH SÁCH */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">Không có khóa học nào</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-xl shadow hover:shadow-lg transition-all border overflow-hidden group">
                <div className="relative overflow-hidden">
                  <img 
                    src={`${API_URL}${course.thumbnail}`} 
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-medium">
                    {course.level}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">Mã: {course.code}</p>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}h
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {(course.students ?? 0).toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={`/admin/courses/${course.id}/chapters`}
                      className="flex items-center justify-center gap-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 text-xs transition"
                    >
                      <Film className="w-4 h-4" />
                      Chương
                    </Link>

                    <button
                      onClick={() => handleQuiz(course.id)}
                      className="flex items-center justify-center gap-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 text-xs transition"
                    >
                      <FileText className="w-4 h-4" />
                      Bài tập
                    </button>

                    <Link
                      to={`/admin/courses/${course.id}/edit`}
                      className="flex items-center justify-center gap-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 text-xs transition"
                    >
                      <Edit className="w-4 h-4" />
                      Sửa
                    </Link>

                    <button
                      onClick={() => handleSendNotify(course.id)}
                      className="flex items-center justify-center gap-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 text-xs transition"
                    >
                      <Bell className="w-4 h-4" />
                      Thông báo
                    </button>

                    <button
                      onClick={() => setShowDelete(course.id)}
                      className="col-span-2 flex items-center justify-center gap-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 text-xs transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa khóa học
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PHÂN TRANG */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-3 mt-8">
              <p className="text-sm text-gray-600">
                Trang <span className="font-bold text-blue-600">{currentPage}</span> / {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg font-medium transition ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white shadow-md'
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
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODAL XÓA */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-3">Xác nhận xóa</h3>
            <p className="text-gray-700 mb-6">Bạn có chắc chắn muốn xóa khóa học này?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
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

      {/* MODAL THÔNG BÁO */}
      {showNotify && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Gửi thông báo</h3>
              <button onClick={() => setShowNotify(null)} className="text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input 
              placeholder="Tiêu đề" 
              value={notifyTitle}
              onChange={e => setNotifyTitle(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded-md"
            />
            <textarea 
              placeholder="Nội dung..." 
              value={notifyContent}
              onChange={e => setNotifyContent(e.target.value)}
              rows="4"
              className="w-full mb-3 px-3 py-2 border rounded-md"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowNotify(null)} className="flex-1 border px-4 py-2 rounded hover:bg-gray-50">
                Hủy
              </button>
              <button onClick={sendNotify} className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BÀI TẬP */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Tạo câu hỏi trắc nghiệm</h3>
              <button onClick={() => setShowQuiz(null)} className="text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              placeholder="Nhập câu hỏi..."
              value={quizQuestion}
              onChange={e => setQuizQuestion(e.target.value)}
              rows="3"
              className="w-full mb-4 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
            />

            <div className="space-y-3 mb-4">
              {quizOptions.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={correctAnswer === letter}
                      onChange={() => setCorrectAnswer(letter)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <input
                      placeholder={`Đáp án ${letter}`}
                      value={opt}
                      onChange={e => {
                        const newOpts = [...quizOptions];
                        newOpts[i] = e.target.value;
                        setQuizOptions(newOpts);
                      }}
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowQuiz(null)} className="flex-1 border px-4 py-2 rounded hover:bg-gray-50">
                Hủy
              </button>
              <button onClick={createQuiz} className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Tạo câu hỏi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesList;