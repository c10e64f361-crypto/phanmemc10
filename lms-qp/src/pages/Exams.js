// src/pages/Exams.js
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExamSidebar from '../components/ExamSidebar';
import ExamCard from '../components/ExamCard'; // ← ĐÚNG
import { examCategories } from '../data/examData';

const Exams = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* ... search bar ... */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80">
            <ExamSidebar />
          </div>
          <div className="flex-1 space-y-6">
            {examCategories.map((cat, i) => (
              <div key={i}>
                <h2 className="text-xl font-bold text-blue-900 mb-4">{cat.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cat.exams.map(exam => (
                    <ExamCard key={exam.id} exam={exam} /> 
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Exams;