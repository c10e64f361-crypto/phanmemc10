// src/pages/admin/AdminCertificates.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Award, Search, Calendar, User, BookOpen ,AlertCircle} from 'lucide-react';

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_URL}/api/certificate/all`, {
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

  const filteredCerts = certificates.filter(cert => 
    cert.fullName.toLowerCase().includes(search.toLowerCase()) ||
    cert.course_title.toLowerCase().includes(search.toLowerCase())
  );

  // src/pages/admin/AdminCertificates.js
// Thay vì: window.open(url + `?token=${token}`)
// Dùng fetch + blob để tải file với header

const handleDownload = async (userId, courseId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/api/certificate/${userId}/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Lỗi tải PDF');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ChungChi_${userId}_${courseId}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert('Không thể tải chứng chỉ');
  }
};

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải chứng chỉ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <p className="text-red-700 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">
          <Award className="inline w-10 h-10 mr-3" />
          Quản lý chứng chỉ đã cấp
        </h1>

        {/* TÌM KIẾM */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm học viên, khóa học..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {filteredCerts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Award className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Chưa có chứng chỉ nào được cấp</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map(cert => (
              <div key={`${cert.user_id}-${cert.course_id}`} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
                  <Award className="w-12 h-12 mb-3" />
                  <h3 className="text-xl font-bold">{cert.course_title}</h3>
                  <p className="text-sm opacity-90 mt-1">Hoàn thành 100%</p>
                </div>
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{cert.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Cấp ngày: {new Date(cert.issued_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(cert.user_id, cert.course_id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition transform hover:scale-105"
                  >
                    <Download className="w-5 h-5" />
                    Tải lại PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCertificates;