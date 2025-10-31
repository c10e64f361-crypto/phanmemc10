// src/components/CoursePlayer.js
import React, { useRef, useState } from 'react';

const CoursePlayer = ({ videoUrl, chapterTitle, onProgress }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlay = () => {
    videoRef.current.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    videoRef.current.pause();
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progress);
    onProgress(progress);
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-xl">
      <div className="relative">
        <iframe
          src={videoUrl}
          className="w-full h-96"
          frameBorder="0"
          allowFullScreen
        />
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded">
          {chapterTitle}
        </div>
      </div>
      
      <div className="p-4 bg-gray-900">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">{chapterTitle}</h3>
          <div className="flex gap-2">
            <button
              onClick={handlePlay}
              className={`px-4 py-2 rounded ${isPlaying ? 'bg-gray-600' : 'bg-blue-600'} text-white`}
            >
              ▶️ Phát
            </button>
            <button
              onClick={handlePause}
              className={`px-4 py-2 rounded ${isPlaying ? 'bg-red-600' : 'bg-gray-600'} text-white`}
            >
              ⏸️ Tạm dừng
            </button>
          </div>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;