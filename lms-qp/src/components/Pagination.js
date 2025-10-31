// src/components/Pagination.js
import React from 'react';

const Pagination = () => {
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button className="text-gray-500 hover:text-gray-700">&lt;</button>
      <button className="w-8 h-8 bg-red-600 text-white rounded flex items-center justify-center font-bold">1</button>
      <button className="w-8 h-8 bg-gray-200 text-gray-700 rounded flex items-center justify-center">2</button>
      <button className="w-8 h-8 bg-gray-200 text-gray-700 rounded flex items-center justify-center">3</button>
      <button className="text-gray-500 hover:text-gray-700">&gt;</button>
    </div>
  );
};

export default Pagination;