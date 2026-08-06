'use client';

import { useState, useEffect, useCallback } from 'react';

interface Comment {
  id: number;
  article_id: number;
  author_name: string;
  content: string;
  created_at: string;
}

export default function CommentSection({ articleId }: { articleId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?articleId=${articleId}`);
      const data = await res.json();
      setComments(data.comments);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!authorName.trim() || !content.trim()) {
      setError('请填写昵称和评论内容');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, authorName: authorName.trim(), content: content.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '评论失败');
        return;
      }
      setComments((prev) => [data.comment, ...prev]);
      setContent('');
    } catch {
      setError('评论失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-xl font-bold mb-6">评论 ({comments.length})</h3>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 rounded-lg p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="你的昵称"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="写下你的评论..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? '提交中...' : '发表评论'}
        </button>
      </form>

      {/* Comments list */}
      {loading ? (
        <p className="text-gray-400">加载评论中...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400">暂无评论，来说两句吧</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white border border-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-gray-900">{comment.author_name}</span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
