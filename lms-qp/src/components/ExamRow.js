// src/components/ExamRow.js
import React from 'react';
import { FileText } from 'lucide-react';

const ExamRow = ({ exam, index }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3 text-center text-sm">{index}</td>
      <td className="px-4 py-3 text-sm font-medium">{exam.waveName}</td>
      <td className="px-4 py-3 text-sm">{exam.examName}</td>
      <td className="px-4 py-3 text-xs text-gray-700">{exam.start}</td>
      <td className="px-4 py-3 text-xs text-gray-700">{exam.end}</td>
      <td className="px-4 py-3 text-center text-sm">{exam.duration}</td>
      <td className="px-4 py-3 text-center text-sm">{exam.attempts}</td>
      <td className="px-4 py-3 text-center text-sm">{exam.scoring}</td>
      <td className="px-4 py-3 text-center">
        <button className="flex items-center gap-1 mx-auto px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-200 transition">
          <FileText className="w-3 h-3" />
          Xem chi tiết
        </button>
      </td>
    </tr>
  );
};

export default ExamRow;