// src/pages/ExamList.js
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExamCard from '../components/ExamCard';
import { exams } from '../data/exams';

const ExamList = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">Thi trực tuyến</h1>
        {exams.length > 0 ? (
          exams.map(exam => <ExamCard key={exam.id} exam={exam} />)
        ) : (
          <p className="text-center text-gray-500 py-10">Chưa có kỳ thi nào</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ExamList;