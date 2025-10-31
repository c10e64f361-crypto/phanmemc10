// src/pages/MyExams.js
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExamRow from '../components/ExamRow';
import { myExams } from '../data/myExamData';

const MyExams = () => {
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');

  const filteredExams = myExams.filter(exam => {
    return (
      (!search || exam.waveName.toLowerCase().includes(search.toLowerCase()) || exam.examName.toLowerCase().includes(search.toLowerCase())) &&
      (!year || exam.start.includes(year))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Search & Filter */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Từ khóa</label>
              <input
                type="text"
                placeholder="Nhập từ khóa tìm kiếm"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Chọn năm</label>
              <select
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">Tất cả</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
            <div className="col-span-2">
              <button className="w-full md:w-auto bg-blue-900 text-white px-6 py-2 rounded-md font-medium text-sm flex items-center justify-center gap-1">
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">STT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tên đợt thi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tên ca thi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Từ ngày</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Đến ngày</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Thời gian làm bài (phút)</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Số lần làm bài</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Cách thức lấy điểm</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map((exam, i) => (
                <ExamRow key={exam.id} exam={exam} index={i + 1} />
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-gray-200 rounded">First</button>
              <button className="w-8 h-8 bg-blue-900 text-white rounded flex items-center justify-center font-bold">1</button>
              <button className="p-1 hover:bg-gray-200 rounded">Next</button>
            </div>
            <div className="flex items-center gap-2">
              <span>Hiển thị</span>
              <select className="border rounded px-2 py-1">
                <option>20</option>
                <option>50</option>
              </select>
              <span>dòng</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyExams;