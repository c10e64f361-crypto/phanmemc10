// src/components/LearnSidebar.js
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, PlayCircle, Lock, CheckCircle } from 'lucide-react';

const LearnSidebar = ({ chapters, currentChapter, onChapterClick }) => {
  return (
    <div className="w-80 bg-white border-r overflow-y-auto">
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-4">Nội dung khóa học</h3>
        <div className="space-y-1">
          {chapters.map(chapter => (
            <button
              key={chapter.id}
              onClick={() => onChapterClick(chapter)}
              className={`w-full text-left px-3 py-2 rounded transition ${
                currentChapter?.id === chapter.id
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'hover:bg-gray-100'
              }`}
            >
              {chapter.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearnSidebar;