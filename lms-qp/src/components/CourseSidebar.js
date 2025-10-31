// src/components/CourseSidebar.js
import React, { useState } from 'react';
import { sidebarData } from '../data/courseData';

const CourseSidebar = () => {
  const [selectedTarget, setSelectedTarget] = useState("Tất cả đối tượng");
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full lg:w-80 bg-white rounded-lg shadow-sm p-4 space-y-6">
      {/* Đối tượng */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">Đối tượng</h3>
        <div className="space-y-2">
          {sidebarData.targets.map((item, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="target"
                checked={selectedTarget === item}
                onChange={() => setSelectedTarget(item)}
                className="w-4 h-4 text-red-600"
              />
              <span className="text-sm">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <hr />

      {/* Danh mục */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">Danh mục khóa học</h3>
        <div className="space-y-1">
          {sidebarData.categories.map((cat, i) => {
            const isExpanded = expanded[cat];
            const hasChildren = cat.includes(">");
            return (
              <div key={i}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-yellow-600 rounded" />
                  <span className="text-sm flex-1">{cat.split(" > ")[0]}</span>
                  {hasChildren && (
                    <button
                      onClick={(e) => { e.preventDefault(); toggleExpand(cat); }}
                      className="text-xs text-gray-500"
                    >
                      {isExpanded ? "−" : "+"}
                    </button>
                  )}
                </label>
                {isExpanded && hasChildren && (
                  <div className="ml-6 mt-1 text-xs text-gray-600">
                    {cat.split(" > ")[1]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;