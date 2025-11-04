// src/components/LearnVideo.js
import React from 'react';

// src/components/LearnVideo.js
const LearnVideo = ({ videoUrl, title }) => {
  if (!videoUrl) {
    return (
      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-6">
        <p className="text-gray-500">Chưa có video</p>
      </div>
    );
  }

  const fullUrl = `${videoUrl}`;
  console.log('Video URL ok:', fullUrl);
  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
      <video 
        src={fullUrl} 
        controls 
        className="w-full h-full"
        preload="metadata"
      >
        Trình duyệt không hỗ trợ video.
      </video>
    </div>
  );
};

export default LearnVideo;