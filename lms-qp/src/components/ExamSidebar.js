// src/components/ExamSidebar.js
import React from 'react';
import { Calendar, Clock, Filter } from 'lucide-react';

const ExamSidebar = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-6">
      <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
        <Filter className="w-5 h-5" />
        Bộ lọc kỳ thi
      </h3>

      {/* DANH MỤC */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3">Danh mục</h4>
        <ul className="space-y-2">
          {['Chuyển đổi số', 'AI & Công nghệ', 'An ninh mạng', 'Lãnh đạo'].map((cat, i) => (
            <li key={i}>
              <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm">{cat}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* THỜI GIAN */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Thời gian
        </h4>
        <select className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option>Tất cả</option>
          <option>Hôm nay</option>
          <option>Tuần này</option>
          <option>Tháng này</option>
        </select>
      </div>

      {/* TRẠNG THÁI */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3">Trạng thái</h4>
        <div className="space-y-2">
          {[
            { label: 'Đang mở', color: 'bg-green-100 text-green-800' },
            { label: 'Chưa mở', color: 'bg-yellow-100 text-yellow-800' },
            { label: 'Đã kết thúc', color: 'bg-gray-100 text-gray-800' }
          ].map((status, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="status" className="w-4 h-4 text-blue-600" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                {status.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* NÚT ÁP DỤNG */}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition">
        Áp dụng bộ lọc
      </button>
    </div>
  );
};

export default ExamSidebar;