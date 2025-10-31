// src/components/ExerciseList.js
import React, { useState } from 'react';
import { Upload, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

const ExerciseList = ({ exercises, onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);

  const handleFileChange = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleSubmit(id, file);
    }
  };

  const handleSubmit = (id, file) => {
    setSubmittingId(id);
    setTimeout(() => {
      onSubmit(id, file.name);
      setSubmittingId(null);
      setSelectedFile(null);
    }, 1000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'chưa nộp': return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">Chưa nộp</span>;
      case 'đã nộp': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Đã nộp</span>;
      case 'đã chấm': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Đã chấm</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {exercises.map(ex => (
        <div key={ex.id} className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-semibold text-lg">{ex.title}</h4>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Hạn nộp: {ex.deadline}
                </div>
                {getStatusBadge(ex.status)}
              </div>
            </div>
          </div>

          {ex.status === 'đã nộp' && ex.score !== null && (
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Điểm: {ex.score}/10</span>
                </div>
                {ex.feedback && <p className="text-sm text-green-700">{ex.feedback}</p>}
              </div>
            </div>
          )}

          {ex.status === 'chưa nộp' ? (
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                <Upload className="w-4 h-4" />
                Nộp bài
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, ex.id)}
                />
              </label>
              {submittingId === ex.id && (
                <span className="text-sm text-blue-600">Đang nộp...</span>
              )}
            </div>
          ) : ex.status === 'đã nộp' ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              Đã nộp: {ex.file}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default ExerciseList;