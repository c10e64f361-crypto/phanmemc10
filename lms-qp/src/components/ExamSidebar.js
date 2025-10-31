// src/components/ExamSidebar.js
import React, { useState } from 'react';
import { sidebarExams } from '../data/examData';

const ExamSidebar = () => {
  const [selected, setSelected] = useState("Tất cả");

  return (
    <div className="w-full lg:w-80 bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-bold text-gray-800 mb-4">Kỳ thi</h3>
      <div className="space-y-3">
        {sidebarExams.map((item, i) => (
          <label
            key={i}
            className="flex items-center gap-2 cursor-pointer text-sm"
          >
            <input
              type="radio"
              name="exam"
              checked={selected === item}
              onChange={() => setSelected(item)}
              className="w-4 h-4 text-red-600"
            />
            <span className={selected === item ? "font-semibold text-red-600" : ""}>
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ExamSidebar;