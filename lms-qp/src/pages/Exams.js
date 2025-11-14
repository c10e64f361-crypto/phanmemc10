// src/pages/Exams.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExamSidebar from '../components/ExamSidebar';
import { Search, Calendar, Clock, Users, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // PHÂN TRANG TỪ BACKEND
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // LẤY DỮ LIỆU + PHÂN TRANG
  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);

    const statusMap = {
      all: '',
      open: 'Đang mở',
      upcoming: 'Chưa mở',
      ended: 'Đã kết thúc'
    };

    axios.get(`${API_URL}/api/exams`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        status: statusMap[activeTab]
      }
    })
    .then(res => {
      setExams(res.data.data || []);
      setPagination({
        page: res.data.pagination.page,
        limit: res.data.pagination.limit,
        total: res.data.pagination.total,
        totalPages: res.data.pagination.totalPages
      });
      setLoading(false);
    })
    .catch(err => {
      console.error('Lỗi tải kỳ thi:', err);
      setLoading(false);
    });
  }, [pagination.page, searchTerm, activeTab]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang mở': return 'bg-green-100 text-green-800';
      case 'Chưa mở': return 'bg-yellow-100 text-yellow-800';
      case 'Đã kết thúc': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'all', label: 'Tất cả', count: pagination.total },
    { id: 'open', label: 'Đang mở', count: 0 }, // Backend sẽ tính
    { id: 'upcoming', label: 'Chưa mở', count: 0 },
    { id: 'ended', label: 'Đã kết thúc', count: 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">
          Danh sách kỳ thi
        </h1>

        {/* TÌM KIẾM */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm kỳ thi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* TAB */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              {tab.label} ({tab.id === 'all' ? pagination.total : '...'})
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 order-2 lg:order-1">
            <ExamSidebar />
          </aside>

          <main className="flex-1 order-1 lg:order-2">
            {loading ? (
              <div className="text-center py-12">Đang tải...</div>
            ) : exams.length === 0 ? (
              <div className="text-center py-12 text-gray-500">Không tìm thấy kỳ thi nào</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {exams.map(exam => {
                    const start = new Date(exam.start_time);
                    const end = new Date(exam.end_time);
                    const now = new Date();
                    const isOpen = now >= start && now <= end;

                    return (
                      <div key={exam.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2">{exam.title}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{exam.description}</p>

                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{start.toLocaleString('vi-VN')} - {end.toLocaleString('vi-VN')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{exam.duration} phút</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>{exam.max_attempts} lần thi</span>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                              {exam.status}
                            </span>
                            {isOpen && (
                              <Link to={`/exams/${exam.id}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium">
                                Vào thi <ChevronRight className="w-4 h-4" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* PHÂN TRANG */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex gap-1">
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                          className={`w-10 h-10 rounded-lg font-medium transition ${
                            pagination.page === i + 1
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.totalPages}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Exams;