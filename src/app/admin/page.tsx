import Link from 'next/link';
import { getAllArticlesForAdmin } from '@/lib/db';
import AdminArticleActions from './AdminArticleActions';

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const { articles, totalPages } = await getAllArticlesForAdmin(page, 20);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 写文章
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">还没有文章</p>
          <Link
            href="/admin/articles/new"
            className="text-blue-600 hover:underline"
          >
            去写第一篇 →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">标题</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">状态</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">标签</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">创建时间</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                        article.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {article.published ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {article.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {new Date(article.created_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <AdminArticleActions articleId={article.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {page > 1 && (
            <Link href={`/admin?page=${page - 1}`} className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
              上一页
            </Link>
          )}
          <span className="px-4 py-2 text-gray-500">第 {page} / {totalPages} 页</span>
          {page < totalPages && (
            <Link href={`/admin?page=${page + 1}`} className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
              下一页
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
