// src/pages/Courses.js
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseSidebar from '../components/CourseSidebar';
import CourseCard from '../components/CourseCard';
import { courseCategories } from '../data/courseData';

const Courses = () => {
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
            <CourseSidebar />
          </div>
          <div className="flex-1 space-y-10">
            {courseCategories.map((section, i) => (
              <section key={i}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-blue-900">{section.title}</h2>
                  <a href="#" className="text-sm text-blue-600">Xem thêm</a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {section.courses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Courses;