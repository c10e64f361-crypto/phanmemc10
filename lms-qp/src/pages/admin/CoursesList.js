// src/pages/admin/CoursesList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Film, FileText, Bell, X ,Clock,Users} from 'lucide-react';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(null);
  const [showNotify, setShowNotify] = useState(null);
  const [showQuiz, setShowQuiz] = useState(null);

  // Thông báo
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyContent, setNotifyContent] = useState('');

  // Bài tập
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizOptions, setQuizOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('A');

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // LẤY DANH SÁCH KHÓA HỌC
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data.data);
    } catch (err) {
      console.error('Lỗi tải khóa học:', err);
      alert('Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // XÓA KHÓA HỌC
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(prev => prev.filter(c => c.id !== id));
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
      alert('Vui lòng nhập tiêu đề và nội dung');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/courses/${showNotify}/announcements`, {
        title: notifyTitle,
        content: notifyContent
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Gửi thông báo thành công!');
      setShowNotify(null);
    } catch (err) {
      alert('Gửi thất bại');
    }
  };

  // TẠO CÂU HỎI TRẮC NGHIỆM
  const handleQuiz = (courseId) => {
    setShowQuiz(courseId);
    setQuizQuestion('');
    setQuizOptions(['', '', '', '']);
    setCorrectAnswer('A');
  };

  // Trong createQuiz()
const createQuiz = async () => {
  if (!quizQuestion.trim() || quizOptions.some(opt => !opt.trim())) {
    alert('Vui lòng nhập đầy đủ');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    await axios.post(`${API_URL}/api/courses/${showQuiz}/questions`, {
      title: quizQuestion,
      options: quizOptions, // ← MẢNG 4 PHẦN TỬ
      correct_answer: correctAnswer
    }, { headers: { Authorization: `Bearer ${token}` } });
    alert('Tạo thành công!');
    setShowQuiz(null);
  } catch (err) {
    console.error('Lỗi tạo:', err.response?.data);
    alert('Tạo thất bại');
  }
};

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Quản lý khóa học</h1>
        <Link
          to="/admin/courses/create"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Tạo khóa học mới
        </Link>
      </div>

      {/* DANH SÁCH KHÓA HỌC */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <img 
              src={`${API_URL}${course.thumbnail}`} 
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

              {/* THÔNG TIN */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration}h
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {(course.students ?? 0).toLocaleString()} học viên
                </div>
              </div>

              {/* CÁC NÚT */}
              <div className="grid grid-cols-2 gap-2">
                {/* QUẢN LÝ CHƯƠNG */}
                <Link
                  to={`/admin/courses/${course.id}/chapters`}
                  className="flex items-center justify-center gap-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm transition"
                >
                  <Film className="w-4 h-4" />
                  Chương
                </Link>

                {/* BÀI TẬP */}
                <button
                  onClick={() => handleQuiz(course.id)}
                  className="flex items-center justify-center gap-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 text-sm transition"
                >
                  <FileText className="w-4 h-4" />
                  Bài tập
                </button>

                {/* SỬA */}
                <Link
                  to={`/admin/courses/${course.id}/edit`}
                  className="flex items-center justify-center gap-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 text-sm transition"
                >
                  <Edit className="w-4 h-4" />
                  Sửa
                </Link>

                {/* GỬI THÔNG BÁO */}
                <button
                  onClick={() => handleSendNotify(course.id)}
                  className="flex items-center justify-center gap-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 text-sm transition"
                >
                  <Bell className="w-4 h-4" />
                  Thông báo
                </button>

                {/* XÓA */}
                <button
                  onClick={() => setShowDelete(course.id)}
                  className="col-span-2 flex items-center justify-center gap-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 text-sm transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa khóa học
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CONFIRM XÓA */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-3">Xác nhận xóa</h3>
            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn xóa khóa học này?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(showDelete)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL GỬI THÔNG BÁO */}
      {showNotify && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Gửi thông báo</h3>
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

      {/* MODAL TẠO CÂU HỎI TRẮC NGHIỆM */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Tạo câu hỏi trắc nghiệm</h3>
              <button onClick={() => setShowQuiz(null)} className="text-gray-500 hover:text-gray-700">
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