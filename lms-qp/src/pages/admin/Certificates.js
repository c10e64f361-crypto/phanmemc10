// src/pages/admin/Certificates.js
import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode.react';
import { Download, Mail, Eye, Search, Calendar } from 'lucide-react';

const Certificates = () => {
  const [search, setSearch] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);
  const certificateRef = useRef();

  // Dữ liệu chứng chỉ mẫu
  const certificates = [
    {
      id: 1,
      fullName: "Nguyễn Văn An",
      cccd: "123456789",
      course: "Kiến thức công nghệ số trong quốc phòng",
      completedDate: "2025-10-30",
      issuedDate: "2025-10-31",
      qrLink: "https://lms-quocphong.vn/verify/abc123"
    },
    {
      id: 2,
      fullName: "Trần Thị Bình",
      cccd: "987654321",
      course: "An ninh mạng cơ bản",
      completedDate: "2025-10-28",
      issuedDate: "2025-10-29",
      qrLink: "https://lms-quocphong.vn/verify/def456"
    }
  ].concat(
    Array.from({ length: 18 }, (_, i) => ({
      id: i + 3,
      fullName: `Học viên ${i + 3}`,
      cccd: `${100000000 + i}`.padStart(9, '0'),
      course: ["Công nghệ số", "AI ứng dụng", "An ninh mạng", "Chuyển đổi số"][Math.floor(Math.random() * 4)],
      completedDate: `2025-10-${String(20 + Math.floor(Math.random() * 10)).padStart(2, '0')}`,
      issuedDate: `2025-10-${String(21 + Math.floor(Math.random() * 10)).padStart(2, '0')}`,
      qrLink: `https://lms-quocphong.vn/verify/cert${i + 3}`
    }))
  );

  const filteredCerts = certificates.filter(c =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.cccd.includes(search) ||
    c.course.toLowerCase().includes(search.toLowerCase())
  );

  const downloadPDF = async () => {
    const element = certificateRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`chung-chi-${selectedCert.cccd}.pdf`);
  };

  const sendEmail = () => {
    alert(`Đã gửi chứng chỉ qua email: ${selectedCert.email || 'hocvien@example.com'}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Quản lý chứng chỉ</h1>

      {/* Tìm kiếm */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm theo tên, CCCD, khóa học..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 outline-none"
        />
      </div>

      {/* Danh sách chứng chỉ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredCerts.map(cert => (
          <div key={cert.id} className="bg-white p-5 rounded-lg shadow-sm border hover:shadow-md transition">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">{cert.fullName}</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Đã cấp</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>CCCD:</strong> {cert.cccd}</p>
              <p><strong>Khóa học:</strong> {cert.course}</p>
              <p><strong>Hoàn thành:</strong> {cert.completedDate}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setSelectedCert(cert)}
                className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
              >
                <Eye className="w-4 h-4" />
                Xem
              </button>
              <button className="p-2 bg-gray-100 rounded hover:bg-gray-200">
                <Mail className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Xem trước chứng chỉ */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Xem trước chứng chỉ</h3>
              <button
                onClick={() => setSelectedCert(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {/* Mẫu chứng chỉ - Ẩn khi in */}
            <div className="p-6" ref={certificateRef}>
              <div className="relative bg-gradient-to-br from-blue-50 to-red-50 p-12 rounded-lg border-4 border-double border-gold-600" style={{ fontFamily: 'Times New Roman, serif' }}>
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-blue-900">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>
                  <p className="text-lg font-medium">Độc lập - Tự do - Hạnh phúc</p>
                  <div className="w-32 h-1 bg-red-600 mx-auto mt-2"></div>
                </div>

                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-red-700">CHỨNG CHỈ</h2>
                  <p className="text-xl mt-2">HOÀN THÀNH KHÓA HỌC</p>
                </div>

                {/* Nội dung */}
                <div className="text-left space-y-6 text-lg">
                  <p className="text-center font-medium">
                    Cấp cho học viên:
                  </p>
                  <p className="text-center text-2xl font-bold text-blue-900">
                    {selectedCert.fullName}
                  </p>
                  <p><strong>CCCD:</strong> {selectedCert.cccd}</p>
                  <p><strong>Đã hoàn thành khóa học:</strong></p>
                  <p className="text-xl font-semibold text-blue-800 pl-4">
                    "{selectedCert.course}"
                  </p>
                  <p><strong>Ngày hoàn thành:</strong> {selectedCert.completedDate}</p>
                  <p><strong>Ngày cấp chứng chỉ:</strong> {selectedCert.issuedDate}</p>
                </div>

                {/* QR Code */}
                <div className="absolute bottom-12 right-12 bg-white p-3 rounded-lg shadow-lg">
                  <QRCode value={selectedCert.qrLink} size={100} />
                  <p className="text-xs text-center mt-1">Xác thực tại: lms-quocphong.vn</p>
                </div>

                {/* Chữ ký */}
                <div className="absolute bottom-12 left-12 text-center">
                  <p className="font-medium">GIÁM ĐỐC TRUNG TÂM</p>
                  <div className="h-20"></div>
                  <p className="font-bold">Thiếu tướng Nguyễn Văn A</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t flex gap-3 justify-end">
              <button
                onClick={sendEmail}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Mail className="w-4 h-4" />
                Gửi email
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                Tải PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;