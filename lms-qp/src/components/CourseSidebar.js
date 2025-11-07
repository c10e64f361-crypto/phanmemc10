// src/components/CourseSidebar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, FolderOpen } from 'lucide-react';

const CourseSidebar = ({ selectedCategoryId, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/categories`);
        if (res.data.success && Array.isArray(res.data.data)) {
          setCategories([
            { id: '', title: 'Tất cả danh mục' },
            ...res.data.data
          ]);
        }
      } catch (err) {
        console.error('Lỗi tải danh mục:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border">
      <div className="flex items-center gap-3 mb-6">
        <FolderOpen className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">Lọc theo chủ đề</h3>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p className="text-sm">Không tải được danh mục</p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map(cat => (
            <button
              key={cat.id || 'all'}
              onClick={() => onCategorySelect(cat.id || '')} // GỬI ID, KHÔNG GỬI TITLE
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-3 ${
                selectedCategoryId === (cat.id || '')
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="w-2 h-2 bg-current rounded-full"></div>
              {cat.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseSidebar;