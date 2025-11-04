// src/components/LearnSidebar.js
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, Play, Clock } from 'lucide-react';

const LearnSidebar = ({ chapters, currentChapter, onChapterClick }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTree = (items, level = 0) => {
    return items.map(chapter => {
      const hasChildren = chapter.children && chapter.children.length > 0;
      const isExpanded = expanded[chapter.id];
      const isActive = currentChapter?.id === chapter.id;

      return (
        <div key={chapter.id}>
          {/* CHƯƠNG CHA HOẶC CON */}
          <button
            onClick={() => {
              if (hasChildren) toggleExpand(chapter.id);
              else onChapterClick(chapter);
            }}
            className={`w-full text-left px-4 py-2.5 rounded transition flex items-center gap-2 ${
              isActive
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'hover:bg-gray-100'
            }`}
            style={{ paddingLeft: `${level * 24 + 16}px` }}
          >
            {/* ICON PHÂN BIỆT */}
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(chapter.id);
                }}
                className="text-gray-600"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <Play className="w-4 h-4 text-gray-400" />
            )}

            {/* ICON CHƯƠNG */}
            {hasChildren ? (
              <Folder className="w-5 h-5 text-yellow-600" />
            ) : (
              <div className="w-5 h-5" />
            )}

            {/* TIÊU ĐỀ */}
            <span className={`flex-1 ${hasChildren ? 'font-semibold' : ''}`}>
              {chapter.title}
            </span>

            {/* THỜI LƯỢNG (CHỈ CHƯƠNG CON) */}
            {!hasChildren && chapter.duration > 0 && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {chapter.duration}p
              </span>
            )}
          </button>

          {/* CHƯƠNG CON */}
          {hasChildren && isExpanded && (
            <div className="border-l-2 border-gray-200 ml-6">
              {renderTree(chapter.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-80 bg-white border-r overflow-y-auto h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Nội dung khóa học</h3>
      </div>
      <div className="p-2">
        {renderTree(chapters)}
      </div>
    </div>
  );
};

export default LearnSidebar;