// src/components/ExamCard.js
import React from 'react';

const ExamCard = ({ exam }) => {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-4 flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-32 h-32 bg-gray-200 border-2 border-dashed rounded-lg"></div>
      <div className="flex-1">
        <h3 className="font-bold text-lg mb-2">{exam.title}</h3>
        <div className="text-sm text-gray-600 space-y-1 mb-3">
          <div className="flex items-center gap-1">
            <span>Thời gian:</span> {exam.time}
          </div>
          <div className="flex items-center gap-1">
            <span>Lượt thi:</span> {exam.participants.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <span>Lượt xem:</span> {exam.views.toLocaleString()}
          </div>
        </div>
        <button className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

export default ExamCard;