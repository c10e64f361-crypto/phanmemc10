// src/pages/admin/Categories.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Edit2, Trash2, X, Check, Loader2 } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // LẤY DANH SÁCH DANH MỤC
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data.data);
    } catch (err) {
      alert('Lỗi tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // TÌM KIẾM
  const filteredCategories = categories.filter(cat =>
    cat.title.toLowerCase().includes(search.toLowerCase())
  );

  // THÊM DANH MỤC
  const handleAdd = async () => {
    if (!newCategory.title.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/categories`, newCategory, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories([...categories, res.data.data]);
      setNewCategory({ title: '', description: '' });
      setShowAddModal(false);
    } catch (err) {
      alert('Thêm danh mục thất bại');
    }
  };

  // SỬA DANH MỤC
  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditForm({ title: cat.title, description: cat.description || '' });
  };

  const saveEdit = async (id) => {
    if (!editForm.title.trim()) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/categories/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(categories.map(cat =>
        cat.id === id ? { ...cat, ...editForm } : cat
      ));
      setEditingId(null);
    } catch (err) {
      alert('Sửa danh mục thất bại');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: '', description: '' });
  };

  // XÓA DANH MỤC
  const handleDelete = async (id) => {
    if (!window.confirm('Xóa danh mục này? Các khóa học liên quan sẽ bị ảnh hưởng!')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (err) {
      alert('Xóa danh mục thất bại');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Quản lý danh mục</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Thêm danh mục
        </button>
      </div>

      {/* TÌM KIẾM */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* DANH SÁCH */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Không có danh mục nào
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tên danh mục</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Mô tả</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">#{cat.id}</td>
                  <td className="px-6 py-4">
                    {editingId === cat.id ? (
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-2 py-1 border rounded"
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium">{cat.title}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {editingId === cat.id ? (
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-2 py-1 border rounded"
                        placeholder="Mô tả (tùy chọn)"
                      />
                    ) : (
                      cat.description || <span className="text-gray-400 italic">Không có mô tả</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {editingId === cat.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => saveEdit(cat.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => startEdit(cat)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL THÊM DANH MỤC */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Thêm danh mục mới</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên danh mục</label>
                <input
                  type="text"
                  value={newCategory.title}
                  onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Ví dụ: Lập trình"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả (tùy chọn)</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                  placeholder="Mô tả ngắn về danh mục"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm danh mục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;