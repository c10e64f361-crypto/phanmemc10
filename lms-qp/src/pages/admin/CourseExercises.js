// src/pages/admin/CourseExercises.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Upload, Clock, FileText, CheckCircle, XCircle } from 'lucide-react';

const CourseExercises = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dữ liệu bài tập mẫu
  const [exercises, setExercises] = useState([
    {
      id: 1,
      title: "Bài tập 1: Phân tích Cloud Computing",
      deadline: "2025-11-15T23:59",
      file: "baitap1.pdf",
      submissions: [
        { student: "Nguyễn Văn A", file: "nopbai1.pdf", score: 85, status: "Đã chấm" },
        { student: "Trần Thị B", file: "nopbai2.docx", score: null, status: "Chưa chấm" }
      ]
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [form, setForm] = useState({
    title: '',
    deadline: '',
    file: null
  });

  const [showSubmissions, setShowSubmissions] = useState(null);
  const [scoreInput, setScoreInput] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingExercise) {
      setExercises(prev => prev.map(ex =>
        ex.id === editingExercise.id
          ? { ...ex, title: form.title, deadline: form.deadline, file: form.file?.name || ex.file }
          : ex
      ));
    } else {
      const newExercise = {
        id: Date.now(),
        title: form.title,
        deadline: form.deadline,
        file: form.file?.name || null,
        submissions: []
      };
      setExercises(prev => [...prev, newExercise]);
    }
    setShowForm(false);
    setEditingExercise(null);
    setForm({ title: '', deadline: '', file: null });
  };

  const handleDelete = (id) => {
    if (window.confirm('Xóa bài tập này?')) {
      setExercises(prev => prev.filter(ex => ex.id !== id));
    }
  };

  const handleScore = (exerciseId, studentName, score) => {
    setExercises(prev => prev.map(ex =>
      ex.id === exerciseId
        ? {
            ...ex,
            submissions: ex.submissions.map(sub =>
              sub.student === studentName
                ? { ...sub, score: parseInt(score), status: "Đã chấm" }
                : sub
            )
          }
        : ex
    ));
    setScoreInput(prev => ({ ...prev, [`${exerciseId}-${studentName}`]: '' }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Quay lại
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Quản lý bài tập - Khóa học ID: {id}</h1>
        <button
          onClick={() => {
            setEditingExercise(null);
            setForm({ title: '', deadline: '', file: null });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Tạo bài tập
        </button>
      </div>

      {/* Danh sách bài tập */}
      <div className="space-y-6">
        {exercises.map(exercise => (
          <div key={exercise.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{exercise.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Hạn nộp: {new Date(exercise.deadline).toLocaleString('vi-VN')}
                  </div>
                  {exercise.file && (
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {exercise.file}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingExercise(exercise);
                    setForm({ title: exercise.title, deadline: exercise.deadline, file: null });
                    setShowForm(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(exercise.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Nút xem nộp bài */}
            <button
              onClick={() => setShowSubmissions(exercise.id === showSubmissions ? null : exercise.id)}
              className="text-blue-600 hover:underline text-sm flex items-center gap-1"
            >
              Xem {exercise.submissions.length} bài nộp
              {showSubmissions === exercise.id ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            </button>

            {/* Bảng nộp bài */}
            {showSubmissions === exercise.id && exercise.submissions.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-3 py-2 text-left">Học viên</th>
                      <th className="px-3 py-2 text-left">File nộp</th>
                      <th className="px-3 py-2 text-center">Điểm</th>
                      <th className="px-3 py-2 text-center">Trạng thái</th>
                      <th className="px-3 py-2 text-center">Chấm điểm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {exercise.submissions.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-3 py-2">{sub.student}</td>
                        <td className="px-3 py-2">
                          <a href="#" className="text-blue-600 hover:underline flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {sub.file}
                          </a>
                        </td>
                        <td className="px-3 py-2 text-center">{sub.score ?? '-'}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            sub.status === 'Đã chấm' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          {sub.score === null ? (
                            <div className="flex items-center gap-1 justify-center">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="0-100"
                                value={scoreInput[`${exercise.id}-${sub.student}`] || ''}
                                onChange={e => setScoreInput(prev => ({
                                  ...prev,
                                  [`${exercise.id}-${sub.student}`]: e.target.value
                                }))}
                                className="w-16 p-1 border rounded text-center"
                              />
                              <button
                                onClick={() => handleScore(exercise.id, sub.student, scoreInput[`${exercise.id}-${sub.student}`])}
                                className="p-1 bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-green-600 font-medium">{sub.score}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form tạo/sửa bài tập */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">
              {editingExercise ? 'Sửa bài tập' : 'Tạo bài tập mới'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Tên bài tập</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border rounded-lg"
                  placeholder="VD: Bài tập 1: Phân tích Cloud"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Hạn nộp</label>
                <input
                  type="datetime-local"
                  required
                  value={form.deadline}
                  onChange={e => setForm(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">File đề bài</label>
                <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-5 h-5" />
                  {form.file ? form.file.name : 'Chọn file (.pdf, .docx)'}
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={e => setForm(prev => ({ ...prev, file: e.target.files[0] }))}
                    className="hidden"
                  />
                </label>
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
                  {editingExercise ? 'Cập nhật' : 'Tạo bài tập'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseExercises;