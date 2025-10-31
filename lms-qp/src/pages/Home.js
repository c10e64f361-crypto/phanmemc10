// src/pages/Home.js
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroBanner from '../components/HeroBanner';
import CategoryGrid from '../components/CategoryGrid';
import CourseSection from '../components/CourseSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroBanner />
      <CategoryGrid />
      <CourseSection />
      <Footer />
    </div>
  );
};

export default Home;