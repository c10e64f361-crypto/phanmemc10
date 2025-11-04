// src/components/DiscussionForum.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, ThumbsUp, MessageSquare, Trash2 } from 'lucide-react';

const DiscussionForum = ({ courseId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchComments = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${API_URL}/api/courses/${courseId}/discussions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setComments(res.data.data);
  };

  useEffect(() => {
    fetchComments();
  }, [courseId]);

  const handleComment = async () => {
    const token = localStorage.getItem('token');
    await axios.post(`${API_URL}/api/courses/${courseId}/discussions`, {
      content: newComment
    }, { headers: { Authorization: `Bearer ${token}` } });
    setNewComment('');
    fetchComments();
  };

  const handleReply = async (parentId) => {
    const token = localStorage.getItem('token');
    await axios.post(`${API_URL}/api/courses/${courseId}/discussions`, {
      content: replyText,
      parent_id: parentId
    }, { headers: { Authorization: `Bearer ${token}` } });
    setReplyText('');
    setReplyTo(null);
    fetchComments();
  };

  const handleLike = async (id) => {
    const token = localStorage.getItem('token');
    await axios.post(`${API_URL}/api/courses/${courseId}/discussions/${id}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchComments();
  };


const handleDelete = async (id) => {
  if (!window.confirm('Xóa bình luận này?')) return; // ← ĐÃ SỬA
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/api/courses/${courseId}/discussions/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  fetchComments();
};

  const Comment = ({ comment, level = 0 }) => (
    <div className={`${level > 0 ? 'ml-10 border-l-2 border-gray-200 pl-4' : ''} mb-4`}>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{comment.user_name}</p>
            <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <button onClick={() => handleLike(comment.id)} className="flex items-center gap-1 hover:text-blue-600">
                <ThumbsUp className="w-4 h-4" /> {comment.likes}
              </button>
              <button onClick={() => setReplyTo(comment.id)} className="flex items-center gap-1 hover:text-blue-600">
                <MessageSquare className="w-4 h-4" /> Trả lời
              </button>
              <span>{new Date(comment.created_at).toLocaleString('vi-VN')}</span>
            </div>
          </div>
          <button onClick={() => handleDelete(comment.id)} className="text-red-600 hover:text-red-800">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {replyTo === comment.id && (
          <div className="mt-3 flex gap-2">
            <input
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Viết trả lời..."
              className="flex-1 px-3 py-2 border rounded-md text-sm"
            />
            <button onClick={() => handleReply(comment.id)} className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700">
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {comment.replies && comment.replies.map(reply => (
        <Comment key={reply.id} comment={reply} level={level + 1} />
      ))}
    </div>
  );

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex gap-2">
          <input
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Viết bình luận..."
            className="flex-1 px-3 py-2 border rounded-md text-sm"
          />
          <button onClick={handleComment} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default DiscussionForum;