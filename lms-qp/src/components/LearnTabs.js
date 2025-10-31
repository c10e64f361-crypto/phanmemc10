// src/components/LearnTabs.js
import React from 'react';
import { MessageCircle, FileText, BarChart, Bell } from 'lucide-react';

const LearnTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'content', label: 'NỘI DUNG', icon: FileText },
    { id: 'exercise', label: 'BÀI TẬP', icon: FileText },
    
    { id: 'results', label: 'KẾT QUẢ HỌC TẬP', icon: BarChart },
    { id: 'discussion', label: 'THẢO LUẬN', icon: MessageCircle },
    { id: 'announcement', label: 'THÔNG BÁO', icon: Bell },
  ];

  return (
    <div className="border-b bg-white">
      <div className="flex gap-8 px-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 py-4 border-b-2 transition ${
              activeTab === tab.id 
                ? 'border-blue-600 text-blue-600 font-semibold' 
                : 'border-transparent text-gray-600 hover:text-blue-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LearnTabs;