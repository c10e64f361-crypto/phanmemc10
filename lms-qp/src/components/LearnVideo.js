// src/components/LearnVideo.js
import React from 'react';

const LearnVideo = ({ videoUrl, title }) => {
  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
      <iframe
        src={videoUrl}
        className="w-full h-96 md:h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
      />
    </div>
  );
};

export default LearnVideo;