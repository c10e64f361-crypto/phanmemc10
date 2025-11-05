// src/pages/user/Certificates.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Download, ArrowLeft, Award, Calendar, AlertCircle } from 'lucide-react';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // LẤY DANH SÁCH CHỨNG CHỈ TỪ API
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập');
      setLoading(false);
      return;
    }

    axios.get(`${API_URL}/api/learning/certificates`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setCertificates(res.data.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Lỗi tải chứng chỉ:', err);
      setError('Không thể tải danh sách chứng chỉ');
      setLoading(false);
    });
  }, []);

  // LỌC THEO TRẠNG THÁI
  const filteredCerts = certificates.filter(cert => 
    !statusFilter || cert.type === statusFilter
  );

  // TẢI CHỨNG CHỈ
  const handleDownload = (courseId) => {
    const token = localStorage.getItem('token');
    const url = `${API_URL}/api/certificate/${certificates[0].user_id}/${courseId}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải chứng chỉ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <p className="text-red-700 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

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
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
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
                {filteredCerts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                      <Award className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>Bạn chưa có chứng chỉ nào</p>
                    </td>
                  </tr>
                ) : (
                  filteredCerts.map((cert, i) => (
                    <tr key={cert.course_id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{i + 1}</td>
                      <td className="px-4 py-3 text-sm font-mono">{cert.code || 'CH' + cert.course_id + cert.user_id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{cert.course_title}</td>
                      <td className="px-4 py-3 text-sm">{new Date(cert.issued_at).toLocaleDateString('vi-VN')}</td>
                      <td className="px-4 py-3 text-sm">Không giới hạn</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          cert.type === 'Công khai' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {cert.type || 'Nội bộ'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDownload(cert.course_id)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mx-auto"
                        >
                          <Download className="w-4 h-4" />
                          Tải
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-end text-xs text-gray-600">
            <span>Hiển thị 1-{filteredCerts.length} của {filteredCerts.length} kết quả</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Certificates;