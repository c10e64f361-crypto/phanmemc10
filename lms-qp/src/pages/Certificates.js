// src/pages/Certificates.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CertificateRow from '../components/CertificateRow';
import { certificates } from '../data/certificateData';
import { Download, ArrowLeft } from 'lucide-react';

const Certificates = () => {
  const [status, setStatus] = useState('');

  const filteredCerts = certificates.filter(cert => {
    return !status || cert.type === status;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Title + Back + Export */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-xl font-bold text-blue-900">Danh sách chứng chỉ được cấp</h1>
            <div className="flex gap-3">
              <Link
                to="/my-courses"
                className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </Link>
              <button className="flex items-center gap-1 px-4 py-2 bg-blue-900 text-white rounded-md text-sm font-medium hover:bg-blue-800 transition">
                <Download className="w-4 h-4" />
                Kết xuất
              </button>
            </div>
          </div>

          {/* Filter */}
          <div className="flex justify-end mb-4">
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="px-4 py-2 border rounded-md text-sm"
            >
              <option value="">-- Chọn trạng thái --</option>
              <option value="Nội bộ">Nội bộ</option>
              <option value="Công khai">Công khai</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">STT</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Mã chứng chỉ</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tên chứng chỉ</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Ngày cấp</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Ngày hết hạn</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Kiểu loại</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCerts.map((cert, i) => (
                  <CertificateRow key={cert.id} cert={cert} index={i + 1} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-end text-xs text-gray-600">
            <span>Hiển thị 1-2 của 2 kết quả</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Certificates;