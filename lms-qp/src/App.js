// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// === USER ===
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Exams from './pages/Exams';
import Library from './pages/Library';
import MyCourses from './pages/MyCourses';
import MyExams from './pages/MyExams';
import Certificates from './pages/Certificates';
import CourseDetail from './pages/CourseDetail';
import CourseLearn from './pages/CourseLearn';
import ExamList from './pages/ExamList';
import ExamDetail from './pages/ExamDetail';
import ExamStart from './pages/ExamStart';
import QuizExam from './pages/QuizExam';
// === ADMIN ===
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCourses from './pages/admin/ManageCourses';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCertificates from './pages/admin/ManageCertificates';
import CoursesList from './pages/admin/CoursesList';
import CreateCourse from './pages/admin/CreateCourse';
import CourseExercises from './pages/admin/CourseExercises';
import ExamsList from './pages/admin/ExamsList';
import CreateExam from './pages/admin/CreateExam';
import ExamQuestions from './pages/admin/ExamQuestions';
import QuestionBank from './pages/admin/QuestionBank';
import UserManagement from './pages/admin/UserManagement';
import Reports from './pages/admin/Reports';
import Dashboard from './pages/admin/Dashboard';
import AdminLayout from './layouts/AdminLayout';

// import Certificates from './pages/admin/Certificates';
// === ROUTE GUARDS ===
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import CourseChapters from './pages/admin/CourseChapters';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>

        {/* === PUBLIC ROUTES === */}
        {user ? (
          <>
            {/* Nếu đã login → không cho vào login/register */}
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            {/* Nếu chưa login → chỉ thấy login/register */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}

        {/* === USER PROTECTED ROUTES === */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/library" element={<Library />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/my-exams" element={<MyExams />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/courses/:id" element={<CourseDetail />} />

  <Route path="/courses/:id/learn" element={<CourseLearn />} />
  <Route path="/exams" element={<ExamList />} />
  <Route path="/exams/:id" element={<ExamDetail />} />

  <Route path="/exams/:id/start" element={<ExamStart />} />

  <Route path="/exams/:id/quiz" element={<QuizExam />} />

        </Route>

        {/* === ADMIN PROTECTED ROUTES === */}
       {/* TẤT CẢ ADMIN DÙNG 1 LAYOUT */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/courses" element={<CoursesList />} />
            <Route path="/admin/courses/create" element={<CreateCourse />} />
            <Route path="/admin/courses/:id/chapters" element={<CourseChapters />} />
            <Route path="/admin/courses/:id/exercises" element={<CourseExercises />} />
            <Route path="/admin/exams" element={<ExamsList />} />
            <Route path="/admin/exams/create" element={<CreateExam />} />
            <Route path="/admin/exams/:id/questions" element={<ExamQuestions />} />
            <Route path="/admin/questions" element={<QuestionBank />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/certificates" element={<Certificates />} />
          </Route>
        </Route>

        {/* === DEFAULT REDIRECT === */}
        <Route
          path="*"
          element={<Navigate to={user ? '/' : '/login'} replace />}
        />

      </Routes>
    </Router>
  );
}

export default App;