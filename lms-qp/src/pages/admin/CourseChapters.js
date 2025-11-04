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
import { useSortable } from '@dnd-kit/sortable';
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
  ArrowLeft,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const CourseChapters = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [expanded, setExpanded] = useState({});

  // Form
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    duration: '', 
    parent_id: '' 
  });
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // LẤY CHƯƠNG (CÂY)
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

    const flatChapters = flattenTree(chapters);
    const oldIndex = flatChapters.findIndex(c => c.id === active.id);
    const newIndex = flatChapters.findIndex(c => c.id === over.id);
    const newFlat = arrayMove(flatChapters, oldIndex, newIndex);

    // Cập nhật order_number
    const updates = newFlat.map((ch, idx) => [ch.id, idx + 1]);
    const token = localStorage.getItem('token');
    await axios.post(`${API_URL}/api/courses/${courseId}/chapters/reorder`, {
      order: updates.map(([id]) => id)
    }, { headers: { Authorization: `Bearer ${token}` } });

    // Cập nhật tree
    setChapters(buildTree(newFlat));
  };

  // HÀM HỖ TRỢ CÂY
  const flattenTree = (nodes) => {
    let flat = [];
    nodes.forEach(node => {
      flat.push({ ...node, children: [] });
      if (node.children) flat.push(...flattenTree(node.children));
    });
    return flat;
  };

  const buildTree = (flat) => {
    const map = {};
    const roots = [];
    flat.forEach(ch => {
      map[ch.id] = { ...ch, children: [] };
    });
    flat.forEach(ch => {
      if (ch.parent_id && map[ch.parent_id]) {
        map[ch.parent_id].children.push(map[ch.id]);
      } else {
        roots.push(map[ch.id]);
      }
    });
    return roots;
  };

  // THÊM/SỬA CHƯƠNG
  const handleSave = async () => {
    // Trong handleSave
const formData = new FormData();
formData.append('title', form.title);
formData.append('description', form.description || '');
if (form.duration) formData.append('duration', form.duration); // ← CHỈ GỬI NẾU CÓ
if (form.parent_id) formData.append('parent_id', form.parent_id);
if (videoFile) formData.append('video', videoFile);

    const token = localStorage.getItem('token');
    const url = showEdit 
      ? `${API_URL}/api/courses/${courseId}/chapters/${showEdit}`
      : `${API_URL}/api/courses/${courseId}/chapters`;

    const method = showEdit ? 'put' : 'post';

    await axios[method](url, formData, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    resetForm();
    fetchChapters();
  };

  const resetForm = () => {
    setForm({ title: '', description: '', duration: '', parent_id: '' });
    setVideoFile(null);
    setVideoPreview('');
    setShowAdd(false);
    setShowEdit(null);
  };

  // XÓA
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
      duration: chapter.duration,
      parent_id: chapter.parent_id || ''
    });
    setVideoPreview(chapter.video_url ? `${API_URL}${chapter.video_url}` : '');
    setShowEdit(chapter.id);
  };

  // COMPONENT CHƯƠNG KÉO THẢ
  const SortableChapter = ({ chapter, level = 0 }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: chapter.id });

    const style = { transform: CSS.Transform.toString(transform), transition };

    const hasChildren = chapter.children && chapter.children.length > 0;
    const isExpanded = expanded[chapter.id];

    return (
      <div ref={setNodeRef} style={style}>
        <div className="bg-white p-3 rounded-lg shadow-sm mb-2 flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-move">
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>

          {hasChildren && (
            <button
              onClick={() => setExpanded(prev => ({ ...prev, [chapter.id]: !prev[chapter.id] }))}
              className="text-gray-600"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}

          <div className="flex-1">
            <h4 className="font-medium">{chapter.title}</h4>
            <p className="text-xs text-gray-600">{chapter.description}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              {chapter.video_url ? <Play className="w-3 h-3" /> : null}
              <Clock className="w-3 h-3" />
              <span>{chapter.duration} phút</span>
            </div>
          </div>

          <button onClick={() => openEdit(chapter)} className="text-blue-600 hover:text-blue-800">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => setShowDelete(chapter.id)} className="text-red-600 hover:text-red-800">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-10">
            {chapter.children.map(child => (
              <SortableChapter key={child.id} chapter={child} level={level + 1} />
            ))}
          </div>
        )}
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <h1 className="text-2xl font-bold text-blue-900">Quản lý chương học</h1>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Thêm chương
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={chapters.map(ch => ch.id)} strategy={verticalListSortingStrategy}>
            {chapters.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Chưa có chương nào</p>
            ) : (
              <div className="space-y-2">
                {chapters.map(chapter => (
                  <SortableChapter key={chapter.id} chapter={chapter} />
                ))}
              </div>
            )}
          </SortableContext>
        </DndContext>
      </div>

      {/* MODAL THÊM/SỬA */}
      {(showAdd || showEdit) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{showEdit ? 'Sửa chương' : 'Thêm chương'}</h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <input 
              placeholder="Tên chương" 
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              className="w-full mb-3 px-3 py-2 border rounded-md"
            />
            <textarea 
              placeholder="Mô tả" 
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              rows="2"
              className="w-full mb-3 px-3 py-2 border rounded-md"
            />
          
<input 
  type="number" 
  placeholder="Thời lượng (phút, để trống nếu không có)" 
  value={form.duration}
  onChange={e => setForm({...form, duration: e.target.value})}
  className="w-full mb-3 px-3 py-2 border rounded-md"
/>
            <select 
              value={form.parent_id}
              onChange={e => setForm({...form, parent_id: e.target.value})}
              className="w-full mb-3 px-3 py-2 border rounded-md"
            >
              <option value="">Chương chính</option>
              {chapters.map(ch => (
                <option key={ch.id} value={ch.id}>{ch.title}</option>
              ))}
            </select>

            <div className="mb-4">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded flex items-center gap-2 w-full justify-center">
                <Upload className="w-5 h-5" />
                {videoFile ? 'Đổi video' : 'Chọn video'}
                <input type="file" accept="video/*" onChange={e => {
                  const file = e.target.files[0];
                  setVideoFile(file);
                  setVideoPreview(file ? URL.createObjectURL(file) : '');
                }} className="hidden" />
              </label>
              {videoPreview && (
                <video src={videoPreview} controls className="w-full mt-2 rounded" />
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={resetForm} className="flex-1 border px-4 py-2 rounded hover:bg-gray-50">
                Hủy
              </button>
              <button onClick={handleSave} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {showEdit ? 'Cập nhật' : 'Thêm'}
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
            <p className="text-gray-700 mb-6">Xóa chương này sẽ xóa cả chương con?</p>
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