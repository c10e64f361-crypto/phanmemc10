// src/components/LearningResults.js
import React from 'react';
import { User, Calendar, Clock, Eye, Award, FileText } from 'lucide-react';

const LearningResults = ({ results }) => {
  const { user, details } = results;

  return (
    <div className="space-y-6">
      {/* Thông tin cá nhân */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            THÔNG TIN
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tài khoản</span>
              <span className="font-medium">{user.name} ({user.cccd})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày tham gia</span>
              <span>{user.joinDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng thời gian xem bài giảng (phút)</span>
              <span className="font-medium">{user.totalTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng số lượt xem</span>
              <span>{user.totalViews}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-4">TỔNG KẾT</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-gray-600">Lớp học</div>
                <div className="font-medium">Kiến thức về công nghệ số</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-gray-600">Lần truy cập gần nhất</div>
                <div>{user.lastAccess}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="text-gray-600">Điểm tổng kết</div>
                <div className="font-medium text-xl">{user.overallScore}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-gray-600">Xem lịch sử truy cập</div>
                <button className="text-blue-600 hover:underline text-xs">Xem</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng kết quả chi tiết */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 bg-red-50 border-b">
          <h3 className="font-semibold text-red-700">
            KẾT QUẢ HỌC TẬP: {user.status.toUpperCase()}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Tên</th>
                <th className="px-4 py-3 text-center">Điều kiện hoàn thành</th>
                <th className="px-4 py-3 text-center">Bắt buộc</th>
                <th className="px-4 py-3 text-center">Điểm số / Trọng số</th>
                <th className="px-4 py-3 text-center">Tổng thời gian truy cập (phút)</th>
                <th className="px-4 py-3 text-center">Tổng số lượt xem</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {details.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.id.toString().includes('.') ? (
                        <span className="text-gray-500 ml-6">{item.title}</span>
                      ) : (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">{item.condition}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.required === 'Có' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.required}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{item.score}</td>
                  <td className="px-4 py-3 text-center">{item.time.toFixed(1)}</td>
                  <td className="px-4 py-3 text-center">{item.views}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'Đã hoàn thành' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LearningResults;