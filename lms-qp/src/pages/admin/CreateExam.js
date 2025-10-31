// src/pages/admin/CreateExam.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';

const CreateExam = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    startTime: '',
    endTime: '',
    duration: '',
    questions: []
  });

  const [currentQ, setCurrentQ] = useState({ text: '', options: ['', '', '', ''], correct: 0 });

  const addQuestion = () => {
    if (currentQ.text && currentQ.options.every(o => o)) {
      setForm(prev => ({
        ...prev,
        questions: [...prev.questions, { ...currentQ, id: Date.now() }]
      }));
      setCurrentQ({ text: '', options: ['', '', '', ''], correct: 0 });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.questions.length === 0) {
      alert('Vui lòng thêm ít nhất 1 câu hỏi!');
      return;
    }
    alert('Tạo kỳ thi thành công!');
    navigate('/admin/exams');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Quay lại
      </button>

      <h1 className="text-2xl font-bold text-blue-900 mb-6">Tạo kỳ thi mới</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
        {/* Thông tin kỳ thi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Tên kỳ thi</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Thời lượng (phút)</label>
            <input
              type="number"
              required
              min="1"
              value={form.duration}
              onChange={e => setForm(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Thời gian bắt đầu</label>
            <input
              type="datetime-local"
              required
              value={form.startTime}
              onChange={e => setForm(prev => ({ ...prev, startTime: e.target.value }))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Thời gian kết thúc</label>
            <input
              type="datetime-local"
              required
              value={form.endTime}
              onChange={e => setForm(prev => ({ ...prev, endTime: e.target.value }))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        <hr />

        {/* Thêm câu hỏi */}
        <div>
          <h3 className="font-semibold mb-4">Thêm câu hỏi</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nội dung câu hỏi"
              value={currentQ.text}
              onChange={e => setCurrentQ(prev => ({ ...prev, text: e.target.value }))}
              className="w-full p-3 border rounded-lg"
            />
            {currentQ.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  checked={currentQ.correct === idx}
                  onChange={() => setCurrentQ(prev => ({ ...prev, correct: idx }))}
                />
                <input
                  type="text"
                  placeholder={`Đáp án ${idx + 1}`}
                  value={opt}
                  onChange={e => {
                    const newOpts = [...currentQ.options];
                    newOpts[idx] = e.target.value;
                    setCurrentQ(prev => ({ ...prev, options: newOpts }));
                  }}
                  className="flex-1 p-3 border rounded-lg"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <Plus className="w-4 h-4" />
              Thêm câu hỏi
            </button>
          </div>
        </div>

        {/* Danh sách câu hỏi đã thêm */}
        {form.questions.length > 0 && (
          <div className="border-t pt-4">
            <p className="font-medium mb-2">Đã thêm {form.questions.length} câu hỏi:</p>
            <ol className="space-y-2 text-sm">
              {form.questions.map((q, i) => (
                <li key={q.id} className="flex justify-between">
                  <span>{i + 1}. {q.text}</span>
                  <span className="text-green-600">Đáp án: {q.options[q.correct]}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 border rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tạo kỳ thi
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExam;