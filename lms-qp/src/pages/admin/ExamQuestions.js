// src/pages/admin/ExamQuestions.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  ArrowLeft,
  Search,
  X,
  Check,
} from 'lucide-react';

const ExamQuestions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  // Câu hỏi hiện tại của kỳ thi
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ngân hàng câu hỏi
  const [bankQuestions, setBankQuestions] = useState([]);
  const [selectedBankQuestions, setSelectedBankQuestions] = useState([]);
  const [showBankModal, setShowBankModal] = useState(false);
  const [searchBank, setSearchBank] = useState('');
  const [loadingBank, setLoadingBank] = useState(false);

  // Form nhập tay
  const [form, setForm] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // LẤY CÂU HỎI HIỆN TẠI CỦA KỲ THI
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${API_URL}/api/exams/${examId}/questions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setQuestions(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [examId]);

  // LẤY NGÂN HÀNG CÂU HỎI
  const fetchBankQuestions = async () => {
    setLoadingBank(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/question-bank`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchBank },
      });
      setBankQuestions(res.data.data);
    } catch (err) {
      console.error('Lỗi tải ngân hàng câu hỏi');
    } finally {
      setLoadingBank(false);
    }
  };

  useEffect(() => {
    if (showBankModal) fetchBankQuestions();
  }, [showBankModal, searchBank]);

  // NHẬP TAY
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        `${API_URL}/api/exams/${examId}/questions`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuestions([...questions, res.data.data]);
      setForm({
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: 'A',
      });
    } catch (err) {
      alert('Thêm câu hỏi thất bại');
    }
  };

  // THÊM TỪ NGÂN HÀNG
  const handleAddFromBank = async () => {
    if (selectedBankQuestions.length === 0) return;

    const token = localStorage.getItem('token');
    try {
      const promises = selectedBankQuestions.map((q) => {
        return axios.post(
          `${API_URL}/api/exams/${examId}/questions`,
          {
            question_text: q.question_text,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            correct_answer: q.correct_answer,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      });

      const responses = await Promise.all(promises);
      const newQuestions = responses.map((r) => r.data.data);
      setQuestions([...questions, ...newQuestions]);
      setSelectedBankQuestions([]);
      setShowBankModal(false);
    } catch (err) {
      console.error('Lỗi thêm từ ngân hàng:', err.response?.data || err);
      alert(
        `Thêm câu hỏi thất bại: ${
          err.response?.data?.message || 'Lỗi server'
        }`
      );
    }
  };

  // XÓA
  const handleDelete = async (id) => {
    if (!window.confirm('Xóa câu hỏi này?')) return;
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/api/exams/${examId}/questions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // CHỌN CÂU HỎI TRONG MODAL
  const toggleSelect = (question) => {
    setSelectedBankQuestions((prev) =>
      prev.some((q) => q.id === question.id)
        ? prev.filter((q) => q.id !== question.id)
        : [...prev, question]
    );
  };

  if (loading)
    return <div className="text-center py-8">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* NÚT QUAY LẠI */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại danh sách kỳ thi
        </button>

        <h1 className="text-2xl font-bold text-blue-900 mb-8">
          Câu hỏi kỳ thi
        </h1>

        {/* NÚT CHỌN TỪ NGÂN HÀNG */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowBankModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Chọn từ ngân hàng câu hỏi
          </button>
        </div>

        {/* FORM NHẬP TAY */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Nhập tay câu hỏi mới</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              placeholder="Nội dung câu hỏi"
              value={form.question_text}
              onChange={(e) =>
                setForm({ ...form, question_text: e.target.value })
              }
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
                      onChange={(e) =>
                        setForm({ ...form, correct_answer: e.target.value })
                      }
                      className="w-4 h-4"
                    />
                    <input
                      type="text"
                      placeholder={`Đáp án ${opt.toUpperCase()}`}
                      value={form[`option_${opt}`]}
                      onChange={(e) =>
                        setForm({ ...form, [`option_${opt}`]: e.target.value })
                      }
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
          <h2 className="text-lg font-bold mb-4">
            Danh sách câu hỏi ({questions.length})
          </h2>
          {questions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Chưa có câu hỏi nào
            </p>
          ) : (
            <div className="space-y-4">
              {questions.map((q, i) => (
                <div
                  key={q.id}
                  className="border rounded-lg p-4 hover:shadow transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">
                      Câu {i + 1}: {q.question_text}
                    </h4>
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

      {/* MODAL CHỌN TỪ NGÂN HÀNG */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Chọn câu hỏi từ ngân hàng
              </h2>
              <button
                onClick={() => setShowBankModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search */}
            <div className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi..."
                  value={searchBank}
                  onChange={(e) => setSearchBank(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Danh sách câu hỏi */}
            <div className="flex-1 overflow-y-auto px-6">
              {loadingBank ? (
                <div className="text-center py-8">Đang tải...</div>
              ) : bankQuestions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Không tìm thấy câu hỏi
                </div>
              ) : (
                <div className="space-y-4">
                  {bankQuestions.map((q) => {
                    const options = [q.option_a, q.option_b, q.option_c, q.option_d];

                    return (
                      <div
                        key={q.id}
                        className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedBankQuestions.some((sq) => sq.id === q.id)
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-400 hover:shadow'
                        }`}
                        onClick={() => toggleSelect(q)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox */}
                          <div className="mt-1">
                            {selectedBankQuestions.some(
                              (sq) => sq.id === q.id
                            ) ? (
                              <Check className="w-5 h-5 text-blue-600" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                            )}
                          </div>

                          {/* Nội dung câu hỏi */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              {q.question_text || 'Câu hỏi không có nội dung'}
                            </h4>

                            {/* 4 đáp án */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                              {['A', 'B', 'C', 'D'].map((label, idx) => (
                                <div
                                  key={label}
                                  className={`p-2 rounded flex items-center gap-2 ${
                                    q.correct_answer === label
                                      ? 'bg-green-100 text-green-800 font-medium'
                                      : 'bg-gray-50 text-gray-700'
                                  }`}
                                >
                                  <span className="font-bold">{label}.</span>
                                  <span>{options[idx] || '(Trống)'}</span>
                                </div>
                              ))}
                            </div>

                            {/* Metadata */}
                            <div className="flex gap-4 text-xs text-gray-500 mt-3">
                              <span>
                                Chủ đề:{' '}
                                <strong>{q.category || 'Không có'}</strong>
                              </span>
                              <span>
                                Độ khó:{' '}
                                <strong>
                                  {q.difficulty || 'Trung bình'}
                                </strong>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Đã chọn:{' '}
                <span className="font-bold text-blue-600">
                  {selectedBankQuestions.length}
                </span>{' '}
                câu hỏi
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBankModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddFromBank}
                  disabled={selectedBankQuestions.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Thêm vào kỳ thi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamQuestions;