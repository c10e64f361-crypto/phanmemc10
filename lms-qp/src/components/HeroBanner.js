import React from 'react';

const HeroBanner = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            KỲ THI CHÍNH THỨC
          </h1>
          <h2 className="text-2xl mb-4">
            KHOÁ KIẾN THỨC SỐ - KỸ NĂNG SỐ CƠ BẢN NĂM 2025
          </h2>
          <button className="bg-yellow-500 text-blue-900 px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition">
            Tham gia ngay →
          </button>
        </div>
      </div>
      <div className="absolute inset-0 opacity-20">
        <img src="/banner-bg.png" alt="" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default HeroBanner;