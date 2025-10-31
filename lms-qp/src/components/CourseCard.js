// src/components/CourseCard.js
import React from 'react';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Ảnh khóa học */}
      <div className="relative h-40 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
          {course.tag}
        </div>
        {/* Placeholder cho ảnh - bạn có thể thay bằng <img> thật */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="text-white text-6xl font-bold">DATA</div>
        </div>
      </div>

      {/* Nội dung */}
      <div className="p-4">
        <h3 className="font-bold text-sm line-clamp-2 mb-3 text-gray-800">
          {course.title}
        </h3>

        <div className="text-xs text-gray-500 space-y-1 mb-3">
          <div className="flex items-center gap-1">
            <span>Thời gian:</span>
            <span>{course.start} - {course.end}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Học viên:</span>
            <span>{course.students.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Đã đăng ký:</span>
            <span>{course.enrolled.toLocaleString()}</span>
          </div>
        </div>

        {/* Nút Vào học */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 rounded transition-all duration-200 flex items-center justify-center gap-1">
          Vào học
        </button>
      </div>
    </div>
  );
};

export default CourseCard;