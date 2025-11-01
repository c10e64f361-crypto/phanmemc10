// src/components/LearnVideo.js
import React from 'react';

// src/components/LearnVideo.js
const LearnVideo = ({ videoUrl, title }) => {
  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
      <video 
        src={videoUrl} 
        controls 
        className="w-full h-full"
        title={title}
      >
        Trình duyệt không hỗ trợ video.
      </video>
    </div>
  );
};

export default LearnVideo;