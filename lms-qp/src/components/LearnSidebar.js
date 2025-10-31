// src/components/LearnSidebar.js
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, PlayCircle, Lock, CheckCircle } from 'lucide-react';

const LearnSidebar = ({ lessons, currentLesson, onLessonClick }) => {
  const [expanded, setExpanded] = useState([1]);

  const toggleExpand = (id) => {
    setExpanded(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'current': return <PlayCircle className="w-4 h-4 text-blue-600" />;
      case 'locked': return <Lock className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div className="w-80 bg-white border-r h-full overflow-y-auto">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-blue-900">Nội dung khóa học</h3>
      </div>
      <div className="p-4 space-y-2">
        {lessons.map(lesson => (
          <div key={lesson.id}>
            {lesson.children ? (
              <>
                <div
                  onClick={() => toggleExpand(lesson.id)}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {expanded.includes(lesson.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    <span className="font-medium text-sm">{lesson.title}</span>
                  </div>
                  {getStatusIcon(lesson.status)}
                </div>
                {expanded.includes(lesson.id) && (
                  <div className="ml-8 space-y-1 mt-1">
                    {lesson.children.map(child => (
                      <div
                        key={child.id}
                        onClick={(e) => { e.stopPropagation(); onLessonClick(child); }}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer text-sm ${
                          currentLesson?.id === child.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'
                        }`}
                      >
                        {getStatusIcon(child.status)}
                        <span>{child.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div
                onClick={() => onLessonClick(lesson)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                  currentLesson?.id === lesson.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-sm">{lesson.title}</span>
                {getStatusIcon(lesson.status)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnSidebar;