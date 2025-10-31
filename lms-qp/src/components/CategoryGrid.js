import React from 'react';
import { categories } from '../data/mockData';

const CategoryGrid = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat, i) => (
          <div key={i} className={`${cat.color} rounded-xl p-4 text-center border border-yellow-200`}>
            <div className="text-3xl mb-2">{cat.icon}</div>
            <div className="text-sm font-medium">Các khóa học dành cho</div>
            <div className="font-bold text-gray-800">{cat.title}</div>
            <button className="mt-3 bg-yellow-500 text-blue-900 px-4 py-1 rounded-full text-sm font-medium hover:bg-yellow-400">
              Xem chi tiết →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;