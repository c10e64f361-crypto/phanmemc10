// src/components/CourseRow.js
import React from 'react';
import { BookOpen } from 'lucide-react';

const CourseRow = ({ course, index }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3 text-center text-sm">{index}</td>
      <td className="px-4 py-3 text-sm font-medium">{course.name}</td>
      <td className="px-4 py-3 text-xs text-gray-600">
        <div>Ngày lớp học diễn ra: <strong>{course.start}</strong></div>
        <div>Ngày lớp học kết thúc: <strong>{course.end}</strong></div>
        <div>Ngày tham gia học: <strong>{course.registered}</strong></div>
        <div>Ngày hoàn thành: <em className="text-gray-400">—</em></div>
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
          course.status === 'Hoàn thành' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {course.status}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <button className="flex items-center gap-1 mx-auto px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700 transition">
          <BookOpen className="w-3 h-3" />
          Vào học
        </button>
      </td>
    </tr>
  );
};

export default CourseRow;