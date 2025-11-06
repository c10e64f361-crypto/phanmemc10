// src/pages/admin/DocumentManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';

const DocumentManager = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [formData, setFormData] = useState({ title: '', file: null });
  const [uploading, setUploading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/admin/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(res.data.data);
    } catch (err) {
      alert('Lỗi tải tài liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || (!formData.file && !editingDoc)) return;

    setUploading(true);
    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('title', formData.title);
    if (formData.file) data.append('file', formData.file);

    try {
      if (editingDoc) {
        await axios.put(`${API_URL}/api/admin/documents/${editingDoc.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/api/admin/documents`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      setFormData({ title: '', file: null });
      setEditingDoc(null);
      fetchDocuments();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi lưu tài liệu');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa tài liệu này?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/admin/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDocuments();
    } catch (err) {
      alert('Lỗi xóa');
    }
  };

  const openEdit = (doc) => {
    setEditingDoc(doc);
    setFormData({ title: doc.title, file: null });
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Quản lý tài liệu</h1>
          <button
            onClick={() => {
              setEditingDoc(null);
              setFormData({ title: '', file: null });
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Thêm tài liệu
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-12 text-center">
            <FileText className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
            <p className="text-lg text-yellow-800">Chưa có tài liệu</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map(doc => (
              <div key={doc.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileText className={`w-10 h-10 ${
                      doc.file_type === 'pdf' ? 'text-red-500' :
                      doc.file_type === 'docx' ? 'text-blue-600' :
                      'text-green-600'
                    }`} />
                    <div>
                      <h3 className="font-bold text-gray-800">{doc.title}</h3>
                      <p className="text-sm text-gray-500">{doc.file_type.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(doc)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <a 
                  href={doc.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Xem tài liệu
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL THÊM/SỬA */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingDoc ? 'Sửa tài liệu' : 'Thêm tài liệu mới'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {editingDoc ? 'Thay file (tùy chọn)' : 'Chọn file'}
                </label>
                <input
                  type="file"
                  accept=".pdf,.docx,.pptx"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                  className="w-full"
                  {...(editingDoc ? {} : { required: true })}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    editingDoc ? 'Cập nhật' : 'Thêm'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManager;