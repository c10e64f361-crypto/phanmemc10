// src/pages/CourseDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // ← useNavigate ở đây
import Header from '../components/Header';
import Footer from '../components/Footer';
import CoursePlayer from '../components/CoursePlayer';
import CourseChapters from '../components/CourseChapters';
import { courses } from '../data/courses';
import { Play, Users, Clock, Star } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ← ĐÚNG: trong component
  const [course, setCourse] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);

  useEffect(() => {
    const foundCourse = courses.find(c => c.id === parseInt(id));
    setCourse(foundCourse);
    if (foundCourse?.chapters?.[0]) {
      setCurrentChapter(foundCourse.chapters[0]);
    }
  }, [id]);

  if (!course) return <div className="text-center py-20">Đang tải...</div>;

  const handleChapterClick = (chapter) => {
    setCurrentChapter(chapter);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-blue-100 mb-6">{course.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm mb-6">
                <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full">
                  <Users className="w-4 h-4" />
                  {course.students} học viên
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full">
                  <Star className="w-4 h-4" />
                  {course.reviews} đánh giá
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Thông tin khóa học</h3>
              <div className="space-y-3 text-sm">
                <div><strong>Giảng viên:</strong> {course.instructor}</div>
                <div><strong>Cấp độ:</strong> {course.level}</div>
                <div><strong>Bắt đầu:</strong> {course.startDate}</div>
                <div><strong>Kết thúc:</strong> {course.endDate}</div>
                <div><strong>Giá:</strong> {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString()}đ`}</div>
              </div>
              
              {/* ĐÃ SỬA: useNavigate trong component */}
              <button 
                onClick={() => navigate(`/courses/${course.id}/learn`)}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Bắt đầu học
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {currentChapter && (
            <CoursePlayer
              videoUrl={currentChapter.video}
              chapterTitle={currentChapter.title}
            />
          )}
        </div>

        <div className="lg:col-span-1">
          <CourseChapters
            chapters={course.chapters}
            currentChapter={currentChapter}
            onChapterClick={handleChapterClick}
          />
          
          <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-4">Tiến độ học</h3>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{course.progress}% hoàn thành</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetail;