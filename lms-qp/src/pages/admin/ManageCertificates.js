// src/pages/admin/ManageCertificates.js
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search, Download, RefreshCw } from 'lucide-react';

const ManageCertificates = () => {
  const [certs, setCerts] = useState([
    { id: 1, user: 'Nguyễn Văn A', course: 'BDHVS-01', date: '2025-10-15', status: 'Đã cấp' },
    { id: 2, user: 'Trần Thị B', course: 'ANNM-01', date: '2025-10-10', status: 'Chờ cấp' },
  ]);

  const downloadPDF = (id) => {
    alert(`Tải PDF chứng chỉ #${id}`);
  };

  const reissue = (id) => {
    alert(`Cấp lại chứng chỉ #${id}`);
  };

  return (
    <AdminLayout title="Quản lý chứng chỉ">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm chứng chỉ..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Học viên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Khóa học</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Ngày cấp</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {certs.map(cert => (
              <tr key={cert.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{cert.user}</td>
                <td className="px-6 py-4">{cert.course}</td>
                <td className="px-6 py-4 text-sm">{cert.date}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    cert.status === 'Đã cấp' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {cert.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center flex justify-center gap-2">
                  <button onClick={() => downloadPDF(cert.id)} className="text-blue-600 hover:text-blue-800">
                    <Download className="w-4 h-4" />
                  </button>
                  <button onClick={() => reissue(cert.id)} className="text-green-600 hover:text-green-800">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ManageCertificates;