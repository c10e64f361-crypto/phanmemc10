// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-yellow-50 to-orange-50 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-gray-600">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img src="/logo-qp.png" alt="BQP" className="h-10" />
            <div>
              <div className="font-bold text-red-600">BỘ QUỐC PHÒNG</div>
              <div className="text-xs">NỀN TẢNG BÌNH ĐẲNG HỌC VỤ SỐ</div>
            </div>
          </div>
          <p>Trung tâm ĐTLIêu/BTL86</p>
          <p>qlms@mod.gov.vn</p>
          <p>https://qlms.bqp.vn</p>
        </div>
        <div>
          <h4 className="font-bold mb-2">Thông tin hỗ trợ</h4>
          <p>Đ/c Sỹ Phương: 0375759043</p>
          <p>Đ/c Tuấn Anh: 090.455.6886</p>
          <p>Đ/c Hương: 035.538.5614</p>
        </div>
        <div className="text-right">
          <h4 className="font-bold mb-2">Đơn vị đồng hành</h4>
          <div className="h-8 bg-gray-300 inline-block w-20"></div>
          <p className="mt-2">TẬP ĐOÀN TRÍ NAM</p>
          <p className="italic mt-4">Nghiêm cấm mọi hành vi tấn công, do quét hệ thống.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;