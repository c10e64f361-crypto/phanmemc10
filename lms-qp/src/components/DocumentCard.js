// src/components/DocumentCard.js
import React from 'react';

const DocumentCard = ({ doc }) => {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-4 flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-32 h-32 bg-gray-200 border-2 border-dashed rounded-lg"></div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-sm line-clamp-2 flex-1">{doc.title}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-2">
            {doc.tag}
          </span>
        </div>
        <div className="text-xs text-gray-600 space-y-1 mb-3">
          <div className="flex items-center gap-1">
            <span>Ngày đăng:</span> {doc.date}
          </div>
          <div className="flex items-center gap-1">
            <span>Lượt xem:</span> {doc.views.toLocaleString()}
          </div>
        </div>
        <button className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
          Xem tài liệu
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;