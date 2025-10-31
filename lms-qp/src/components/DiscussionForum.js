// src/components/DiscussionForum.js
import React, { useState } from 'react';
import { MessageCircle, ThumbsUp, Reply, Pin } from 'lucide-react';

const DiscussionForum = ({ discussions: initialDiscussions }) => {
  const [discussions, setDiscussions] = useState(initialDiscussions);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  const handleLike = (id) => {
    setDiscussions(prev => prev.map(d => 
      d.id === id ? { ...d, likes: d.likes + 1 } : d
    ));
  };

  const handleReply = (parentId, content) => {
    const newReply = {
      id: Date.now(),
      author: "Bạn",
      avatar: "https://ui-avatars.com/api/?name=You&background=random",
      content,
      time: "Vừa xong",
      likes: 0
    };
    setDiscussions(prev => prev.map(d => 
      d.id === parentId 
        ? { ...d, replies: [...d.replies, newReply] }
        : d
    ));
    setReplyTo(null);
  };

  const handlePost = () => {
    if (!newComment.trim()) return;
    const newPost = {
      id: Date.now(),
      author: "Bạn",
      avatar: "https://ui-avatars.com/api/?name=You&background=random",
      content: newComment,
      time: "Vừa xong",
      likes: 0,
      replies: [],
      pinned: false
    };
    setDiscussions([newPost, ...discussions]);
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      {/* Đăng bài */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <textarea
          placeholder="Đặt câu hỏi hoặc chia sẻ ý kiến..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          className="w-full p-3 border rounded-lg resize-none"
          rows={3}
        />
        <button
          onClick={handlePost}
          className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Đăng
        </button>
      </div>

      {/* Danh sách bài */}
      {discussions.map(post => (
        <div key={post.id} className="bg-white p-6 rounded-lg shadow-sm border">
          {post.pinned && (
            <div className="flex items-center gap-1 text-amber-600 text-sm mb-2">
              <Pin className="w-4 h-4" />
              Được ghim
            </div>
          )}
          <div className="flex gap-3">
            <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <div className="font-semibold">{post.author}</div>
              <div className="text-sm text-gray-500">{post.time}</div>
              <p className="mt-2">{post.content}</p>
              <div className="flex gap-4 mt-3 text-sm">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Thích ({post.likes})
                </button>
                <button
                  onClick={() => setReplyTo(post.id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
                >
                  <Reply className="w-4 h-4" />
                  Trả lời
                </button>
              </div>

              {/* Trả lời */}
              {post.replies.map(reply => (
                <div key={reply.id} className="mt-4 ml-8 flex gap-3">
                  <img src={reply.avatar} alt={reply.author} className="w-8 h-8 rounded-full" />
                  <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium text-sm">{reply.author}</div>
                    <div className="text-xs text-gray-500">{reply.time}</div>
                    <p className="text-sm mt-1">{reply.content}</p>
                    <button
                      onClick={() => handleLike(reply.id)}
                      className="text-xs text-blue-600 mt-2 flex items-center gap-1"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      Thích ({reply.likes})
                    </button>
                  </div>
                </div>
              ))}

              {/* Form trả lời */}
              {replyTo === post.id && (
                <div className="mt-4 ml-8">
                  <textarea
                    placeholder="Viết trả lời..."
                    className="w-full p-2 border rounded-lg text-sm"
                    rows={2}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleReply(post.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiscussionForum;