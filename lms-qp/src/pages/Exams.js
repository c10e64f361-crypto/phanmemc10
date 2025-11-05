// src/pages/Exams.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExamSidebar from '../components/ExamSidebar';
import { Search, Calendar, Clock, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // LẤY DỮ LIỆU
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_URL}/api/exams`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setExams(res.data.data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  // LỌC + TÌM KIẾM
  useEffect(() => {
    let filtered = exams;

    // LỌC THEO TAB
    const now = new Date();
    if (activeTab !== 'all') {
      filtered = filtered.filter(exam => {
        const start = new Date(exam.start_time);
        const end = new Date(exam.end_time);
        if (activeTab === 'open') return now >= start && now <= end;
        if (activeTab === 'upcoming') return now < start;
        if (activeTab === 'ended') return now > end;
        return true;
      });
    }

    // TÌM KIẾM
    if (searchTerm) {
      filtered = filtered.filter(exam => 
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exam.description && exam.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredExams(filtered);
  }, [exams, searchTerm, activeTab]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang mở': return 'bg-green-100 text-green-800';
      case 'Chưa mở': return 'bg-yellow-100 text-yellow-800';
      case 'Đã kết thúc': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'all', label: 'Tất cả', count: exams.length },
    // Trong tabs - sửa dòng lỗi
{ id: 'open', label: 'Đang mở', count: exams.filter(exam => {
  const start = new Date(exam.start_time);
  const end = new Date(exam.end_time);
  const now = new Date();
  return now >= start && now <= end;
}).length },
    { id: 'upcoming', label: 'Chưa mở', count: exams.filter(e => new Date() < new Date(e.start_time)).length },
    { id: 'ended', label: 'Đã kết thúc', count: exams.filter(e => new Date() > new Date(e.end_time)).length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">
          Danh sách kỳ thi
        </h1>

        {/* Ô TÌM KIẾM */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm kỳ thi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* TAB LỌC */}
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
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

      <div className="flex flex-col lg:flex-row gap-8">
  {/* SIDEBAR */}
  <aside className="lg:w-80 order-2 lg:order-1">
    <ExamSidebar />
  </aside>

          <div className="flex-1">
            {filteredExams.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Không tìm thấy kỳ thi nào
              </div>
            ) : (
              <main className="flex-1 order-1 lg:order-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredExams.map(exam => {
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
                            <span>
                              {start.toLocaleString('vi-VN')} - {end.toLocaleString('vi-VN')}
                            </span>
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
  <Link 
    to={`/exams/${exam.id}`}  // ← ĐÚNG ROUTE
    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
  >
    Vào thi
    <ChevronRight className="w-4 h-4" />
  </Link>
)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              </main>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Exams;