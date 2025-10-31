// src/pages/admin/CreateCourse.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Plus ,Film} from 'lucide-react';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: '',
    image: null,
    chapters: [{ title: '', video: null }]
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const handleChapterVideo = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newChapters = [...form.chapters];
      newChapters[index].video = file.name;
      setForm(prev => ({ ...prev, chapters: newChapters }));
    }
  };

  const addChapter = () => {
    setForm(prev => ({
      ...prev,
      chapters: [...prev.chapters, { title: '', video: null }]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Tạo khóa học thành công!');
    navigate('/admin/courses');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Quay lại
      </button>

      <h1 className="text-2xl font-bold text-blue-900 mb-6">Tạo khóa học mới</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
        {/* Hình ảnh */}
        <div>
          <label className="block font-medium mb-2">Hình ảnh khóa học</label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            {form.image ? (
              <img src={form.image} alt="Preview" className="w-full h-48 object-cover rounded mx-auto" />
            ) : (
              <div className="text-gray-500">
                <Upload className="w-12 h-12 mx-auto mb-2" />
                <p>Kéo thả hoặc click để upload</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>
        </div>

        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Tên khóa học</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border rounded-lg"
              placeholder="VD: Kiến thức về công nghệ số"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Thời lượng</label>
            <input
              type="text"
              required
              value={form.duration}
              onChange={e => setForm(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full p-3 border rounded-lg"
              placeholder="VD: 6 tuần"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Mô tả</label>
          <textarea
            required
            value={form.description}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-3 border rounded-lg"
            rows={4}
            placeholder="Mô tả chi tiết về khóa học..."
          />
        </div>

        {/* Danh sách chương */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block font-medium">Chương học</label>
            <button
              type="button"
              onClick={addChapter}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <Plus className="w-4 h-4" />
              Thêm chương
            </button>
          </div>
          {form.chapters.map((chapter, idx) => (
            <div key={idx} className="flex gap-3 mb-3 items-center">
              <input
                type="text"
                placeholder={`Tên chương ${idx + 1}`}
                value={chapter.title}
                onChange={e => {
                  const newCh = [...form.chapters];
                  newCh[idx].title = e.target.value;
                  setForm(prev => ({ ...prev, chapters: newCh }));
                }}
                className="flex-1 p-3 border rounded-lg"
              />
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                <Film className="w-4 h-4" />
                {chapter.video || 'Upload video'}
                <input
                  type="file"
                  accept="video/*"
                  onChange={e => handleChapterVideo(idx, e)}
                  className="hidden"
                />
              </label>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 border rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tạo khóa học
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;