// src/pages/Library.js
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LibrarySidebar from '../components/LibrarySidebar';
import DocumentCard from '../components/DocumentCard';
import Pagination from '../components/Pagination';
import { documents } from '../data/libraryData';

const Library = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Tìm kiếm theo từ khóa"
              className="flex-1 px-4 py-2 border rounded-lg text-sm"
            />
            <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium">
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80">
            <LibrarySidebar />
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {documents.map(doc => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
            <Pagination />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Library;