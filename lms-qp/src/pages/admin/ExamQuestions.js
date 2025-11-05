// src/pages/admin/ExamQuestions.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Edit } from 'lucide-react';

const ExamQuestions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    question_text: '',
    option_a: '', option_b: '', option_c: '', option_d: '',
    correct_answer: 'A'
  });
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_URL}/api/exams/${examId}/questions`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setQuestions(res.data.data);
      setLoading(false);
    });
  }, [examId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${API_URL}/api/exams/${examId}/questions`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions([...questions, res.data.data]);
      setForm({
        question_text: '',
        option_a: '', option_b: '', option_c: '', option_d: '',
        correct_answer: 'A'
      });
    } catch (err) {
      alert('Thêm câu hỏi thất bại');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa câu hỏi này?')) return;
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/api/exams/${examId}/questions/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setQuestions(questions.filter(q => q.id !== id));
  };

  if (loading) return <div className="text-center py-8">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại danh sách kỳ thi
        </button>

        <h1 className="text-2xl font-bold text-blue-900 mb-8">Câu hỏi kỳ thi</h1>

        {/* FORM THÊM CÂU HỎI */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Thêm câu hỏi mới</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              placeholder="Nội dung câu hỏi"
              value={form.question_text}
              onChange={(e) => setForm({ ...form, question_text: e.target.value })}
              className="w-full p-3 border rounded-lg"
              rows="3"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['a', 'b', 'c', 'd'].map((opt) => (
                <div key={opt}>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      value={opt.toUpperCase()}
                      checked={form.correct_answer === opt.toUpperCase()}
                      onChange={(e) => setForm({ ...form, correct_answer: e.target.value })}
                      className="w-4 h-4"
                    />
                    <input
                      type="text"
                      placeholder={`Đáp án ${opt.toUpperCase()}`}
                      value={form[`option_${opt}`]}
                      onChange={(e) => setForm({ ...form, [`option_${opt}`]: e.target.value })}
                      className="flex-1 p-2 border rounded"
                      required
                    />
                  </label>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm câu hỏi
            </button>
          </form>
        </div>

        {/* DANH SÁCH CÂU HỎI */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold mb-4">Danh sách câu hỏi ({questions.length})</h2>
          {questions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có câu hỏi nào</p>
          ) : (
            <div className="space-y-4">
              {questions.map((q, i) => (
                <div key={q.id} className="border rounded-lg p-4 hover:shadow transition">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Câu {i + 1}: {q.question_text}</h4>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {['a', 'b', 'c', 'd'].map((opt) => (
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamQuestions;