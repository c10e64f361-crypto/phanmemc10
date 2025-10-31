// src/components/CertificateRow.js
import React from 'react';
import { FileText } from 'lucide-react';

const CertificateRow = ({ cert, index }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3 text-center text-sm">{index}</td>
      <td className="px-4 py-3 text-sm font-mono">{cert.code}</td>
      <td className="px-4 py-3 text-sm">{cert.name}</td>
      <td className="px-4 py-3 text-xs text-gray-700">{cert.issuedDate}</td>
      <td className="px-4 py-3 text-xs text-gray-400 text-center">—</td>
      <td className="px-4 py-3 text-center">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          {cert.type}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <button className="flex items-center gap-1 mx-auto px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-200 transition">
          <FileText className="w-3 h-3" />
          Xem chi tiết
        </button>
      </td>
    </tr>
  );
};

export default CertificateRow;