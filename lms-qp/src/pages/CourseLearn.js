// src/pages/CourseLearn.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LearnSidebar from '../components/LearnSidebar';
import LearnVideo from '../components/LearnVideo';
import LearnTabs from '../components/LearnTabs';
import ExerciseList from '../components/ExerciseList';
import LearningResults from '../components/LearningResults';
import DiscussionForum from '../components/DiscussionForum';
import Announcements from '../components/Announcements';
import { ArrowLeft, Users, MessageCircle } from 'lucide-react';

const CourseLearn = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // LẤY KHÓA HỌC + CHƯƠNG
  useEffect(() => {
    const token = localStorage.getItem('token');

    // Lấy khóa học
    axios.get(`${API_URL}/api/courses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setCourse(res.data.data);
      
      // Lấy chương
      return axios.get(`${API_URL}/api/courses/${id}/chapters`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    })
    .then(res => {
      const fetchedChapters = res.data.data;
      setChapters(fetchedChapters);
      setCurrentChapter(fetchedChapters[0] || null);
      setLoading(false);
    })
    .catch(err => {
      console.error('Lỗi tải dữ liệu:', err);
      setLoading(false);
    });
  }, [id]);

  const handleChapterClick = (chapter) => {
    setCurrentChapter(chapter);
    setActiveTab('content');
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!course) {
    return <div className="p-6 text-center">Không tìm thấy khóa học</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Course Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại
            </button>
            <h1 className="text-xl font-bold text-blue-900">
              {course.title}
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
          chapters={chapters}
          currentChapter={currentChapter}
          onChapterClick={handleChapterClick}
        />

        {/* Main Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <LearnTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Nội dung theo tab */}
          <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
            <div className="max-w-7xl mx-auto">

              {/* TAB: NỘI DUNG */}
              {activeTab === 'content' && currentChapter && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">{currentChapter.title}</h2>
                  {currentChapter.video_url ? (
                    <LearnVideo
                      videoUrl={`${API_URL}${currentChapter.video_url}`}
                      title={currentChapter.title}
                    />
                  ) : (
                    <p className="text-gray-500">Chưa có video</p>
                  )}
                  <div className="mt-6 prose max-w-none">
                    <p>{currentChapter.description}</p>
                  </div>
                </div>
              )}

              {/* TAB: BÀI TẬP */}
              {activeTab === 'exercise' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Bài tập</h2>
                  <ExerciseList courseId={id} />
                </div>
              )}

              {/* TAB: KẾT QUẢ HỌC TẬP */}
              {activeTab === 'results' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Kết quả học tập</h2>
                  <LearningResults courseId={id} />
                </div>
              )}

              {/* TAB: THẢO LUẬN */}
              {activeTab === 'discussion' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Thảo luận</h2>
                  <DiscussionForum courseId={id} />
                </div>
              )}

              {/* TAB: THÔNG BÁO */}
              {activeTab === 'announcement' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Thông báo</h2>
                  <Announcements courseId={id} />
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