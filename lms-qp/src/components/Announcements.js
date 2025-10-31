// src/components/Announcements.js
import React, { useState } from 'react';
import { Bell, CheckCircle } from 'lucide-react';

const Announcements = ({ announcements: initialAnnouncements }) => {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  const markAsRead = (id) => {
    setAnnouncements(prev => prev.map(a => 
      a.id === id ? { ...a, read: true } : a
    ));
  };

  return (
    <div className="space-y-4">
      {announcements.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Không có thông báo mới</p>
      ) : (
        announcements.map(ann => (
          <div
            key={ann.id}
            className={`p-4 rounded-lg border ${
              ann.read ? 'bg-white' : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                ann.read ? 'bg-gray-100' : 'bg-blue-100'
              }`}>
                <Bell className={`w-5 h-5 ${ann.read ? 'text-gray-600' : 'text-blue-600'}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{ann.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{ann.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{ann.time}</span>
                  {!ann.read && (
                    <button
                      onClick={() => markAsRead(ann.id)}
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Announcements;