// src/pages/admin/QuestionBank.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    question_text: '',
    option_a: '', option_b: '', option_c: '', option_d: '',
    correct_answer: 'A',
    category: 'Chung',
    difficulty: 'Trung bình'
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_URL}/api/question-bank`, {
      params: { search },
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setQuestions(res.data.data);
      setLoading(false);
    });
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${API_URL}/api/question-bank`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions([res.data.data, ...questions]);
      setShowForm(false);
      setForm({
        question_text: '',
        option_a: '', option_b: '', option_c: '', option_d: '',
        correct_answer: 'A',
        category: 'Chung',
        difficulty: 'Trung bình'
      });
    } catch (err) {
      alert('Thêm thất bại');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa câu hỏi này?')) return;
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/api/question-bank/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-900">Ngân hàng câu hỏi</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
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
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* DANH SÁCH */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Chưa có câu hỏi nào</div>
          ) : (
            questions.map(q => (
              <div key={q.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-lg">{q.question_text}</h3>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
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
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">{q.points} điểm</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FORM THÊM */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
              <h2 className="text-xl font-bold mb-4">Thêm câu hỏi mới</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  placeholder="Nội dung câu hỏi"
                  value={form.question_text}
                  onChange={e => setForm({ ...form, question_text: e.target.value })}
                  className="w-full p-3 border rounded-lg"
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
                          className="w-4 h-4"
                        />
                        <input
                          type="text"
                          placeholder={`Đáp án ${opt.toUpperCase()}`}
                          value={form[`option_${opt}`]}
                          onChange={e => setForm({ ...form, [`option_${opt}`]: e.target.value })}
                          className="flex-1 p-2 border rounded"
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
                    className="flex-1 p-2 border rounded"
                  >
                    <option value="Chung">Chung</option>
                    <option value="AI">AI</option>
                    <option value="Toán">Toán</option>
                  </select>
                  <select
                    value={form.difficulty}
                    onChange={e => setForm({ ...form, difficulty: e.target.value })}
                    className="flex-1 p-2 border rounded"
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
                    className="flex-1 border px-4 py-2 rounded hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Thêm
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