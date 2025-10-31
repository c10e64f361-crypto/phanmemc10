// src/components/CourseChapters.js
import React from 'react';
import { Play, CheckCircle } from 'lucide-react';

const CourseChapters = ({ chapters, currentChapter, onChapterClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <h3 className="px-6 py-4 border-b font-semibold text-blue-900">Chương học</h3>
      <div className="divide-y">
        {chapters.map(chapter => (
          <div
            key={chapter.id}
            onClick={() => onChapterClick(chapter)}
            className={`p-6 cursor-pointer hover:bg-gray-50 transition ${
              currentChapter?.id === chapter.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {chapter.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Play className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <div className="font-medium">{chapter.title}</div>
                  <div className="text-sm text-gray-500">{chapter.duration}</div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                chapter.completed ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
              }`}>
                {chapter.completed ? 'Hoàn thành' : 'Chưa học'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseChapters;