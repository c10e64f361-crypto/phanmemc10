// src/components/CourseSidebar.js
import React from 'react';

const CourseSidebar = ({ selectedTag, onTagSelect }) => {
  const tags = ['Chuyển đổi số', 'An ninh mạng', 'AI', 'Quản lý dữ liệu'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-semibold mb-4">Lọc theo chủ đề</h3>
      <div className="space-y-2">
        <button
          onClick={() => onTagSelect('')}
          className={`w-full text-left px-3 py-2 rounded transition ${
            selectedTag === '' ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100'
          }`}
        >
          Tất cả
        </button>
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`w-full text-left px-3 py-2 rounded transition ${
              selectedTag === tag ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;