// src/components/Announcements.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Check } from 'lucide-react';

const Announcements = ({ courseId }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchAnnouncements = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${API_URL}/api/courses/${courseId}/announcements`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAnnouncements(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [courseId]);

  const markAsRead = async (id) => {
    const token = localStorage.getItem('token');
    await axios.post(`${API_URL}/api/courses/${courseId}/announcements/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, is_read: 1 } : a));
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="space-y-4">
      {announcements.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Chưa có thông báo nào</p>
      ) : (
        announcements.map(ann => (
          <div 
            key={ann.id} 
            className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${
              ann.is_read ? 'border-gray-300' : 'border-blue-500'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  {ann.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">{ann.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(ann.created_at).toLocaleString('vi-VN')}
                </p>
              </div>
              {!ann.is_read && (
                <button
                  onClick={() => markAsRead(ann.id)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                >
                  <Check className="w-4 h-4" />
                  Đánh dấu đã đọc
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Announcements;