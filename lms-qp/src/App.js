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

// === ADMIN ===
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCourses from './pages/admin/ManageCourses';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCertificates from './pages/admin/ManageCertificates';

// === ROUTE GUARDS ===
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

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
        </Route>

        {/* === ADMIN PROTECTED ROUTES === */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/courses" element={<ManageCourses />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/certificates" element={<ManageCertificates />} />
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