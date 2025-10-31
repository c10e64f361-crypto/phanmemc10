// src/pages/admin/QuestionBank.js
import React, { useState, useMemo } from 'react';
import { questionsBank } from '../../data/questionsBank';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

const QuestionBank = () => {
  const [questions, setQuestions] = useState(questionsBank);
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [form, setForm] = useState({
    text: '',
    options: ['', '', '', ''],
    correct: 0,
    topic: ''
  });

  const itemsPerPage = 10;

  // Lọc + Tìm kiếm
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = q.text.toLowerCase().includes(search.toLowerCase());
      const matchesTopic = !topicFilter || q.topic === topicFilter;
      return matchesSearch && matchesTopic;
    });
  }, [questions, search, topicFilter]);

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = filteredQuestions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const topics = [...new Set(questions.map(q => q.topic))];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.text || form.options.some(o => !o)) return;

    if (editingQuestion) {
      setQuestions(prev => prev.map(q =>
        q.id === editingQuestion.id
          ? { ...q, ...form }
          : q
      ));
    } else {
      const newQ = {
        id: Date.now(),
        ...form
      };
      setQuestions(prev => [...prev, newQ]);
    }
    setShowForm(false);
    setEditingQuestion(null);
    setForm({ text: '', options: ['', '', '', ''], correct: 0, topic: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Xóa câu hỏi này?')) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleEdit = (q) => {
    setEditingQuestion(q);
    setForm({
      text: q.text,
      options: [...q.options],
      correct: q.correct,
      topic: q.topic
    });
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Ngân hàng câu hỏi</h1>
        <button
          onClick={() => {
            setEditingQuestion(null);
            setForm({ text: '', options: ['', '', '', ''], correct: 0, topic: '' });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Thêm câu hỏi
        </button>
      </div>

      {/* Tìm kiếm + Lọc */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={topicFilter}
            onChange={e => setTopicFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Tất cả chủ đề</option>
            {topics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Danh sách câu hỏi */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Câu hỏi</th>
              <th className="px-4 py-3 text-center text-sm font-medium">Chủ đề</th>
              <th className="px-4 py-3 text-center text-sm font-medium">Đáp án đúng</th>
              <th className="px-4 py-3 text-center text-sm font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedQuestions.map(q => (
              <tr key={q.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <p className="font-medium line-clamp-2">{q.text}</p>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {q.topic}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-sm text-green-600 font-medium">
                  {q.options[q.correct]}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(q)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Form thêm/sửa */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              {editingQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Nội dung câu hỏi</label>
                <textarea
                  required
                  value={form.text}
                  onChange={e => setForm(prev => ({ ...prev, text: e.target.value }))}
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Chủ đề</label>
                <input
                  type="text"
                  required
                  value={form.topic}
                  onChange={e => setForm(prev => ({ ...prev, topic: e.target.value }))}
                  className="w-full p-3 border rounded-lg"
                  placeholder="VD: AI, Cloud, Cybersecurity"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium">Đáp án</label>
                {form.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={form.correct === idx}
                      onChange={() => setForm(prev => ({ ...prev, correct: idx }))}
                    />
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={e => {
                        const newOpts = [...form.options];
                        newOpts[idx] = e.target.value;
                        setForm(prev => ({ ...prev, options: newOpts }));
                      }}
                      className="flex-1 p-3 border rounded-lg"
                      placeholder={`Đáp án ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingQuestion ? 'Cập nhật' : 'Thêm câu hỏi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;