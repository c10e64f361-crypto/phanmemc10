// src/pages/admin/QuestionBank.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);

  // PHÂN TRANG
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const [form, setForm] = useState({
    question_text: '',
    option_a: '', option_b: '', option_c: '', option_d: '',
    correct_answer: 'A',
    category: 'Chung',
    difficulty: 'Trung bình'
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // LẤY DANH SÁCH + PHÂN TRANG + TÌM KIẾM
  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);

    axios.get(`${API_URL}/api/question-bank`, {
      params: { search, page: pagination.page, limit: pagination.limit },
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const data = res.data?.data || [];
      const pag = res.data?.pagination || { total: 0, totalPages: 1, page: 1, limit: 10 };

      setQuestions(data);
      setPagination(prev => ({
        ...prev,
        page: pag.page,
        limit: pag.limit,
        total: pag.total,
        totalPages: pag.totalPages
      }));
      setLoading(false);
    })
    .catch(err => {
      console.error('Lỗi tải:', err);
      setQuestions([]);
      setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
      setLoading(false);
    });
  }, [search, pagination.page]);

  // Reset về trang 1 khi tìm kiếm
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [search]);

  // MỞ FORM THÊM / SỬA
  const openForm = (question = null) => {
    if (question) {
      setEditQuestion(question);
      setForm({
        question_text: question.question_text,
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        option_d: question.option_d,
        correct_answer: question.correct_answer,
        category: question.category || 'Chung',
        difficulty: question.difficulty || 'Trung bình'
      });
    } else {
      setEditQuestion(null);
      setForm({
        question_text: '',
        option_a: '', option_b: '', option_c: '', option_d: '',
        correct_answer: 'A',
        category: 'Chung',
        difficulty: 'Trung bình'
      });
    }
    setShowForm(true);
  };

  // SUBMIT (THÊM HOẶC SỬA)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      let res;
      if (editQuestion) {
        res = await axios.put(`${API_URL}/api/question-bank/${editQuestion.id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestions(questions.map(q => q.id === editQuestion.id ? res.data.data : q));
      } else {
        res = await axios.post(`${API_URL}/api/question-bank`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (pagination.page === 1) {
          setQuestions([res.data.data, ...questions.slice(0, pagination.limit - 1)]);
        }
      }
      setShowForm(false);
    } catch (err) {
      alert(editQuestion ? 'Sửa thất bại' : 'Thêm thất bại');
    }
  };

  // XÓA
  const handleDelete = async (id) => {
    if (!window.confirm('Xóa câu hỏi này?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/api/question-bank/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newQuestions = questions.filter(q => q.id !== id);
      setQuestions(newQuestions);

      // Nếu xóa hết ở trang hiện tại → về trang trước
      if (newQuestions.length === 0 && pagination.page > 1) {
        setPagination(prev => ({ ...prev, page: prev.page - 1 }));
      }
    } catch (err) {
      alert('Xóa thất bại');
    }
  };

  // CHUYỂN TRANG
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages && page !== pagination.page) {
      setPagination(prev => ({ ...prev, page }));
    }
  };

  // TẠO DANH SÁCH NÚT TRANG (THÔNG MINH)
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, pagination.page - half);
    let end = Math.min(pagination.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // Trang đầu + ...
    if (start > 1) {
      pages.push(
        <button key={1} onClick={() => goToPage(1)} className="px-3 py-1 rounded text-sm font-medium bg-white border hover:bg-gray-50">
          1
        </button>
      );
      if (start > 2) {
        pages.push(<span key="start-ellipsis" className="px-2 text-gray-500">...</span>);
      }
    }

    // Các trang giữa
    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            pagination.page === i
              ? 'bg-blue-600 text-white'
              : 'bg-white border hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // ... + trang cuối
    if (end < pagination.totalPages) {
      if (end < pagination.totalPages - 1) {
        pages.push(<span key="end-ellipsis" className="px-2 text-gray-500">...</span>);
      }
      pages.push(
        <button
          key={pagination.totalPages}
          onClick={() => goToPage(pagination.totalPages)}
          className="px-3 py-1 rounded text-sm font-medium bg-white border hover:bg-gray-50"
        >
          {pagination.totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-900">Ngân hàng câu hỏi</h1>
          <button
            onClick={() => openForm()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Plus className="w-5 h-5" />
            Thêm câu hỏi
          </button>
        </div>

        {/* TÌM KIẾM */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>
        </div>

        {/* THÔNG TIN PHÂN TRANG */}
        <div className="mb-4 text-sm text-gray-600">
          Hiển thị{' '}
          <strong>
            {pagination.total > 0
              ? `${(pagination.page - 1) * pagination.limit + 1} - ${Math.min(pagination.page * pagination.limit, pagination.total)}`
              : '0'
            }
          </strong>{' '}
          trong <strong>{pagination.total}</strong> câu hỏi
        </div>

        {/* DANH SÁCH CÂU HỎI */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Đang tải...</div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {search ? 'Không tìm thấy câu hỏi nào' : 'Chưa có câu hỏi nào'}
            </div>
          ) : (
            questions.map(q => (
              <div key={q.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-lg flex-1 pr-4">{q.question_text}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => openForm(q)} className="text-blue-600 hover:text-blue-800" title="Sửa">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(q.id)} className="text-red-600 hover:text-red-800" title="Xóa">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {['a', 'b', 'c', 'd'].map(opt => (
                    <div
                      key={opt}
                      className={`p-2 rounded ${
                        q.correct_answer === opt.toUpperCase()
                          ? 'bg-green-100 text-green-800 font-medium'
                          : 'bg-gray-50'
                      }`}
                    >
                      {opt.toUpperCase()}. {q[`option_${opt}`]}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-3 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{q.category}</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">{q.difficulty}</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">{q.points || 1} điểm</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PHÂN TRANG - THÔNG MINH */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => goToPage(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              title="Trang trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {renderPageNumbers()}

            <button
              onClick={() => goToPage(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              title="Trang sau"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* MODAL THÊM / SỬA */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  placeholder="Nội dung câu hỏi"
                  value={form.question_text}
                  onChange={e => setForm({ ...form, question_text: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows="3"
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['a', 'b', 'c', 'd'].map(opt => (
                    <div key={opt}>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correct"
                          value={opt.toUpperCase()}
                          checked={form.correct_answer === opt.toUpperCase()}
                          onChange={e => setForm({ ...form, correct_answer: e.target.value })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <input
                          type="text"
                          placeholder={`Đáp án ${opt.toUpperCase()}`}
                          value={form[`option_${opt}`]}
                          onChange={e => setForm({ ...form, [`option_${opt}`]: e.target.value })}
                          className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                        />
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Chung">Chung</option>
                    <option value="AI">AI</option>
                    <option value="Toán">Toán</option>
                    <option value="Văn học">Văn học</option>
                    <option value="Lập trình">Lập trình</option>
                  </select>
                  <select
                    value={form.difficulty}
                    onChange={e => setForm({ ...form, difficulty: e.target.value })}
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Dễ">Dễ</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Khó">Khó</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 border px-4 py-2 rounded hover:bg-gray-50 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    {editQuestion ? 'Cập nhật' : 'Thêm'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBank;