// src/components/LibrarySidebar.js
import React, { useState } from 'react';
import { libraryCategories } from '../data/libraryData';

const LibrarySidebar = () => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (cat) => {
    setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="w-full lg:w-80 bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-bold text-gray-800 mb-4">Danh mục học liệu</h3>
      <div className="space-y-2">
        {libraryCategories.map((cat, i) => {
          const hasChildren = cat.includes(">");
          const parent = hasChildren ? cat.split(" > ")[0] : cat;
          const child = hasChildren ? cat.split(" > ")[1] : null;
          const isExpanded = expanded[cat];

          return (
            <div key={i}>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" className="w-4 h-4 text-yellow-600 rounded" />
                <span className="flex-1">{parent}</span>
                {hasChildren && (
                  <button
                    onClick={(e) => { e.preventDefault(); toggleExpand(cat); }}
                    className="text-xs text-gray-500"
                  >
                    {isExpanded ? "−" : "+"}
                  </button>
                )}
              </label>
              {isExpanded && child && (
                <div className="ml-6 mt-1 text-xs text-gray-600 border-l-2 border-yellow-200 pl-2">
                  {child}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LibrarySidebar;