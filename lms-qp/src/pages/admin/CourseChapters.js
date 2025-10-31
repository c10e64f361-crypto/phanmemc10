// src/pages/admin/CourseChapters.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowLeft, Plus, Edit, Trash2, Upload, Film, FileText, GripVertical } from 'lucide-react';

// Component con: Mỗi chương có thể kéo thả
const SortableChapter = ({ chapter, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white p-4 rounded-lg shadow-sm border mb-3 flex items-center gap-4 ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-move">
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold">{chapter.title}</h4>
        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
          {chapter.video && (
            <div className="flex items-center gap-1">
              <Film className="w-4 h-4" />
              {chapter.video}
            </div>
          )}
          {chapter.document && (
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {chapter.document}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(chapter)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(chapter.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const CourseChapters = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dữ liệu mẫu (thay bằng API sau)
  const [chapters, setChapters] = useState([
    { id: 1, title: "Chương 1: Giới thiệu công nghệ số", video: "intro.mp4", document: "tai-lieu-1.pdf" },
    { id: 2, title: "Chương 2: Ứng dụng AI trong quốc phòng", video: "ai.mp4", document: null },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [form, setForm] = useState({ title: '', video: null, document: null });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setChapters((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingChapter) {
      setChapters(prev => prev.map(c =>
        c.id === editingChapter.id
          ? { ...c, title: form.title, video: form.video?.name || c.video, document: form.document?.name || c.document }
          : c
      ));
    } else {
      const newChapter = {
        id: Date.now(),
        title: form.title,
        video: form.video?.name || null,
        document: form.document?.name || null
      };
      setChapters(prev => [...prev, newChapter]);
    }
    setShowForm(false);
    setEditingChapter(null);
    setForm({ title: '', video: null, document: null });
  };

  const handleEdit = (chapter) => {
    setEditingChapter(chapter);
    setForm({ title: chapter.title, video: null, document: null });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Xóa chương này?')) {
      setChapters(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Quay lại
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Quản lý chương - Khóa học ID: {id}</h1>
        <button
          onClick={() => {
            setEditingChapter(null);
            setForm({ title: '', video: null, document: null });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Thêm chương
        </button>
      </div>

      {/* Danh sách chương - KÉO THẢ */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={chapters.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {chapters.map(chapter => (
            <SortableChapter
              key={chapter.id}
              chapter={chapter}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Form thêm/sửa chương */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4">
              {editingChapter ? 'Sửa chương' : 'Thêm chương mới'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Tên chương</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border rounded-lg"
                  placeholder="VD: Chương 1: Giới thiệu"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Video bài giảng</label>
                <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-5 h-5" />
                  {form.video ? form.video.name : 'Chọn video (.mp4)'}
                  <input
                    type="file"
                    accept="video/*"
                    onChange={e => setForm(prev => ({ ...prev, video: e.target.files[0] }))}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block font-medium mb-1">Tài liệu đính kèm</label>
                <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-5 h-5" />
                  {form.document ? form.document.name : 'Chọn tài liệu (.pdf)'}
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={e => setForm(prev => ({ ...prev, document: e.target.files[0] }))}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingChapter ? 'Cập nhật' : 'Thêm chương'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseChapters;