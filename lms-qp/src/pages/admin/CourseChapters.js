// src/pages/admin/CourseChapters.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  Play, 
  Clock, 
  Trash2, 
  Plus, 
  Edit, 
  X,
  Upload,
  ArrowLeft
} from 'lucide-react';

const CourseChapters = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [showDelete, setShowDelete] = useState(null);

  // Form thêm/sửa
  const [form, setForm] = useState({ title: '', description: '', duration: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // LẤY DANH SÁCH CHƯƠNG
  const fetchChapters = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/courses/${courseId}/chapters`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChapters(res.data.data);
    } catch (err) {
      console.error('Lỗi tải chương:', err);
      alert('Không thể tải chương học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [courseId]);

  // KÉO THẢ
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setChapters((items) => {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);

      // GỌI API REORDER
      const token = localStorage.getItem('token');
      axios.post(`${API_URL}/api/courses/${courseId}/chapters/reorder`, {
        order: newOrder.map(ch => ch.id)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);

      return newOrder;
    });
  };

  // THÊM CHƯƠNG
  const handleAdd = async () => {
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('duration', form.duration);
    if (videoFile) formData.append('video', videoFile);

    const token = localStorage.getItem('token');
    await axios.post(`${API_URL}/api/courses/${courseId}/chapters`, formData, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    setShowAdd(false);
    setForm({ title: '', description: '', duration: '' });
    setVideoFile(null);
    setVideoPreview('');
    fetchChapters();
  };

  // SỬA CHƯƠNG
  const handleEdit = async () => {
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('duration', form.duration);
    if (videoFile) formData.append('video', videoFile);

    const token = localStorage.getItem('token');
    await axios.put(`${API_URL}/api/courses/${courseId}/chapters/${showEdit}`, formData, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    setShowEdit(null);
    setForm({ title: '', description: '', duration: '' });
    setVideoFile(null);
    setVideoPreview('');
    fetchChapters();
  };

  // XÓA CHƯƠNG
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/api/courses/${courseId}/chapters/${showDelete}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setShowDelete(null);
    fetchChapters();
  };

  // MỞ FORM SỬA
  const openEdit = (chapter) => {
    setForm({
      title: chapter.title,
      description: chapter.description,
      duration: chapter.duration
    });
    setVideoPreview(chapter.video_url ? `${API_URL}${chapter.video_url}` : '');
    setShowEdit(chapter.id);
  };

  // COMPONENT CHƯƠNG KÉO THẢ
  const SortableChapter = ({ chapter }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: chapter.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div ref={setNodeRef} style={style} className="bg-white p-4 rounded-lg shadow mb-3 flex items-center gap-4">
        <div {...attributes} {...listeners} className="cursor-move">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{chapter.title}</h4>
          <p className="text-sm text-gray-600">{chapter.description}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
            {chapter.video_url ? (
              <span className="flex items-center gap-1">
                <Play className="w-3 h-3" /> Có video
              </span>
            ) : (
              <span className="text-gray-400">Chưa có video</span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {chapter.duration} phút
            </span>
          </div>
        </div>
        <button 
          onClick={() => openEdit(chapter)}
          className="text-blue-600 hover:text-blue-800"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setShowDelete(chapter.id)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <h1 className="text-2xl font-bold text-blue-900">Quản lý chương học</h1>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          Thêm chương
        </button>
      </div>

      {/* DANH SÁCH CHƯƠNG */}
      <div className="bg-white p-6 rounded-lg shadow">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={chapters.map(ch => ch.id)} strategy={verticalListSortingStrategy}>
            {chapters.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Chưa có chương nào. Hãy thêm chương đầu tiên!</p>
            ) : (
              <div className="space-y-3">
                {chapters.map(chapter => (
                  <SortableChapter key={chapter.id} chapter={chapter} />
                ))}
              </div>
            )}
          </SortableContext>
        </DndContext>
      </div>

      {/* MODAL THÊM CHƯƠNG */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Thêm chương mới</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input 
              placeholder="Tên chương" 
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              className="w-full mb-3 px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            />
            <textarea 
              placeholder="Mô tả" 
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              rows="3"
              className="w-full mb-3 px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            />
            <input 
              type="number" 
              placeholder="Thời lượng (phút)" 
              value={form.duration}
              onChange={e => setForm({...form, duration: e.target.value})}
              className="w-full mb-3 px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            />
            <div className="mb-4">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded flex items-center gap-2 w-full justify-center">
                <Upload className="w-5 h-5" />
                Chọn video
                <input 
                  type="file" 
                  accept="video/*" 
                  onChange={e => {
                    const file = e.target.files[0];
                    setVideoFile(file);
                    setVideoPreview(file ? URL.createObjectURL(file) : '');
                  }} 
                  className="hidden"
                />
              </label>
              {videoPreview && (
                <video src={videoPreview} controls className="w-full mt-2 rounded" />
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 border px-4 py-2 rounded hover:bg-gray-50">
                Hủy
              </button>
              <button onClick={handleAdd} className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SỬA CHƯƠNG */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Sửa chương</h3>
              <button onClick={() => setShowEdit(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Form giống modal thêm */}
            {/* ... copy từ modal thêm, chỉ đổi handleEdit */}
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowEdit(null)} className="flex-1 border px-4 py-2 rounded hover:bg-gray-50">
                Hủy
              </button>
              <button onClick={handleEdit} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM XÓA */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-3">Xác nhận xóa</h3>
            <p className="text-gray-700 mb-6">Bạn có chắc chắn muốn xóa chương này?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDelete(null)} className="flex-1 border px-4 py-2 rounded hover:bg-gray-50">
                Hủy
              </button>
              <button onClick={handleDelete} className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseChapters;