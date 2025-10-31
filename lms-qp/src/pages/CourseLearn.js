// src/pages/CourseLearn.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LearnSidebar from '../components/LearnSidebar';
import LearnVideo from '../components/LearnVideo';
import LearnTabs from '../components/LearnTabs';
import ExerciseList from '../components/ExerciseList';
import LearningResults from '../components/LearningResults';
import DiscussionForum from '../components/DiscussionForum';
import Announcements from '../components/Announcements';
import { lessons } from '../data/lessons';
import { exercises as initialExercises } from '../data/exercises';
import { learningResults } from '../data/learningResults';
import { discussions as initialDiscussions } from '../data/discussions';
import { announcements as initialAnnouncements } from '../data/announcements';
import { ArrowLeft, Users, MessageCircle } from 'lucide-react';

const CourseLearn = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [currentLesson, setCurrentLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const [exercises, setExercises] = useState(initialExercises);
  const [results] = useState(learningResults);
  const [discussions] = useState(initialDiscussions);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  // Khởi tạo bài học đầu tiên
  useEffect(() => {
    const firstAvailable = lessons
      .flatMap(l => l.children || [l])
      .find(c => c.status !== 'locked');
    setCurrentLesson(firstAvailable || lessons[0]);
  }, []);

  // Xử lý chọn bài học
  const handleLessonClick = (lesson) => {
    if (lesson.status !== 'locked') {
      setCurrentLesson(lesson);
      setActiveTab('content'); // Quay lại tab nội dung khi chọn video
    }
  };

  // Nộp bài tập
  const handleSubmitExercise = (exerciseId, filename) => {
    setExercises(prev =>
      prev.map(ex =>
        ex.id === exerciseId
          ? { ...ex, status: 'đã nộp', file: filename }
          : ex
      )
    );
  };

  // Đánh dấu thông báo đã đọc
  const handleMarkRead = (annId) => {
    setAnnouncements(prev =>
      prev.map(a => (a.id === annId ? { ...a, read: true } : a))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Course Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/courses/${id}`)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại
            </button>
            <h1 className="text-xl font-bold text-blue-900">
              Kiến thức về công nghệ số
            </h1>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Users className="w-4 h-4" />
              Phòng tổ
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
              <MessageCircle className="w-4 h-4" />
              Thảo luận
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar - Danh sách chương */}
        <LearnSidebar
          lessons={lessons}
          currentLesson={currentLesson}
          onLessonClick={handleLessonClick}
        />

        {/* Main Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <LearnTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Nội dung theo tab */}
          <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
            <div className="max-w-7xl mx-auto">

              {/* TAB: NỘI DUNG */}
              {activeTab === 'content' && currentLesson && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">{currentLesson.title}</h2>
                  <LearnVideo
                    videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title={currentLesson.title}
                  />
                </div>
              )}

              {/* TAB: BÀI TẬP */}
              {activeTab === 'exercise' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Bài tập</h2>
                  <ExerciseList
                    exercises={exercises}
                    onSubmit={handleSubmitExercise}
                  />
                </div>
              )}

              {/* TAB: KẾT QUẢ HỌC TẬP */}
              {activeTab === 'results' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Kết quả học tập</h2>
                  <LearningResults results={results} />
                </div>
              )}

              {/* TAB: THẢO LUẬN */}
              {activeTab === 'discussion' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Thảo luận</h2>
                  <DiscussionForum discussions={discussions} />
                </div>
              )}

              {/* TAB: THÔNG BÁO */}
              {activeTab === 'announcement' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Thông báo</h2>
                  <Announcements
                    announcements={announcements}
                    onMarkRead={handleMarkRead}
                  />
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseLearn;