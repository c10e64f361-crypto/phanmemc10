import React from 'react';
import CourseCard from './CourseCard';
import { ongoingCourses, popularCourses } from '../data/mockData';

const CourseSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Đang học tập */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Khoá học đồng chí đang học tập (4)</h2>
          <button className="text-sm text-blue-600">Xem thêm</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ongoingCourses.map(c => <CourseCard key={c.id} course={c} />)}
        </div>
      </section>

      {/* Kỳ thi của tôi */}
      <section>
        <h2 className="text-xl font-bold mb-4">Kỳ thi của tôi (2)</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium">Khoa kiến thức số, kỹ năng số cơ bản</h3>
            <p className="text-sm text-gray-600">Ca thi 1: Ca thi dành cho đối tượng Sĩ quan</p>
            <p className="text-sm">Thời gian: 06:00 05/10/2025 -</p>
            <p className="text-sm">Thời gian làm bài: 45 Phút</p>
            <p className="text-sm">Số câu: 30</p>
            <button className="mt-2 text-blue-600 text-sm">Chi tiết</button>
          </div>
        </div>
      </section>

      {/* Khóa học nhiều đồng chí tham gia */}
      <section>
        <h2 className="text-xl font-bold mb-4">Khoá học nhiều đồng chí tham gia</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCourses.map(c => <CourseCard key={c.id} course={c} />)}
        </div>
      </section>
    </div>
  );
};

export default CourseSection;