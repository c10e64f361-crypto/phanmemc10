// src/components/CourseCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, PlayCircle } from 'lucide-react';

const CourseCard = ({ course }) => {
  // DEBUG: Xem biến môi trường
  console.log('API_URL:', process.env.REACT_APP_API_URL);
  console.log('Thumbnail path:', course.thumbnail);
  console.log('Full URL:', `${process.env.REACT_APP_API_URL}${course.thumbnail}`);
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group">
      <div className="aspect-video bg-gray-200 relative overflow-hidden">
        <img
          src={`${process.env.REACT_APP_API_URL}${course.thumbnail}`} 
  alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.duration || 0}h
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {(course.students ?? 0).toLocaleString()}
          </div>
        </div>

        <Link
          to={`/courses/${course.id}/learn`}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition font-medium"
        >
          <PlayCircle className="w-5 h-5" />
          Vào học
        </Link>
      </div>
    </div>
  );
};

export default CourseCard; // ← PHẢI CÓ DÒNG NÀY