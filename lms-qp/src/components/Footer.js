import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-yellow-50 to-orange-50 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-gray-600">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img src="/logo-qp.png" alt="Đại đội 10" className="h-10" />
            <div>
              <div className="font-bold text-red-600">ĐẠI ĐỘI 10</div>
              <div className="text-xs">BAN THAM MƯU TRUNG ĐOÀN 64</div>
            </div>
          </div>
          <p>NỀN TẢNG BÌNH DÂN HỌC VỤ SỐ DÀNH CHO CHIẾN SĨ</p>
        </div>
        <div>
          <h4 className="font-bold mb-2">Thông tin hỗ trợ</h4>
          <p>Nguyễn Huy Hoàng - Phó Đại đội trưởng</p>
          <p>Nguyễn Văn Đức - Nhân viên thông tin</p>
        </div>
        <div className="text-right">
          <p className="italic mt-4">Nghiêm cấm mọi hành vi tấn công, do quét hệ thống.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;