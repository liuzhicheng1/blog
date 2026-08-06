'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminArticleActions({ articleId }: { articleId: number }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('确定要删除这篇文章吗？此操作不可恢复。')) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/articles/${articleId}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      alert('删除失败');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => router.push(`/admin/articles/${articleId}/edit`)}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        编辑
      </button>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
      >
        {deleting ? '删除中...' : '删除'}
      </button>
    </div>
  );
}
