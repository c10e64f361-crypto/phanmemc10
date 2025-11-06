// components/DocumentCard.js
import React from 'react';
import { FileText, Download, Calendar } from 'lucide-react';

const DocumentCard = ({ doc }) => {
  // KIỂM TRA uploaded_at
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa rõ';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (e) {
      return 'Lỗi ngày';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <FileText className={`w-10 h-10 ${
            doc.file_type === 'pdf' ? 'text-red-500' :
            doc.file_type === 'docx' ? 'text-blue-600' :
            'text-green-600'
          }`} />
          <div>
            <h3 className="font-bold text-gray-800">{doc.title}</h3>
            <p className="text-sm text-gray-500">
              {doc.file_type.toUpperCase()} • {doc.uploaded_by_name || 'Admin'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {formatDate(doc.uploaded_at)}
        </span>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
          {doc.file_type}
        </span>
      </div>

      <a 
        href={doc.file_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        Tải về
      </a>
    </div>
  );
};
export default DocumentCard;