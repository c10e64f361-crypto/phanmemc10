// src/pages/Library.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LibrarySidebar from '../components/LibrarySidebar';
import DocumentCard from '../components/DocumentCard';
import Pagination from '../components/Pagination';
import { Search, FileText, AlertCircle, Loader2 } from 'lucide-react';

const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const Library = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const ITEMS_PER_PAGE = 8;

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchTerm,
        type: selectedType !== 'all' ? selectedType : undefined
      };

      const res = await axios.get(`${API_URL}/api/library`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      setDocuments(res.data.data.documents);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      setError('Không thể tải tài liệu');
      console.error('Lỗi tải tài liệu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [currentPage, searchTerm, selectedType]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchDocuments();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button 
              type="submit"
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Tìm kiếm
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <LibrarySidebar 
              selectedType={selectedType}
              onTypeChange={(type) => {
                setSelectedType(type);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Document Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-12 text-center">
                <FileText className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <p className="text-lg text-yellow-800">Không tìm thấy tài liệu</p>
                <p className="text-sm text-yellow-600 mt-2">Thử thay đổi từ khóa hoặc bộ lọc</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {documents.map(doc => (
                    <DocumentCard key={doc.id} doc={doc} />
                  ))}
                </div>
                <div className="mt-8">
             
<Pagination 
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => {
    setCurrentPage(page); // Cập nhật state → useEffect sẽ gọi API
    window.scrollTo(0, 0); // Cuộn lên đầu
  }}
/>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Library;