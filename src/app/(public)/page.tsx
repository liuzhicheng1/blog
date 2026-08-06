import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import TagBadge from '@/components/TagBadge';
import { getArticles, getAllTags } from '@/lib/db';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const { articles, totalPages } = await getArticles(page, 10);
  const tags = await getAllTags();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-8">最新文章</h1>

          {articles.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">还没有文章</p>
              <Link href="/admin/articles/new" className="text-blue-600 hover:underline mt-2 inline-block">
                去写第一篇 →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  slug={article.slug}
                  excerpt={article.excerpt}
                  created_at={article.created_at}
                  tags={article.tags}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <Link
                  href={`/?page=${page - 1}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  上一页
                </Link>
              )}
              <span className="px-4 py-2 text-gray-500">
                第 {page} / {totalPages} 页
              </span>
              {page < totalPages && (
                <Link
                  href={`/?page=${page + 1}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  下一页
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-56 shrink-0">
          <div className="sticky top-20">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <TagBadge key={tag.id} name={tag.name} />
              ))}
            </div>
            {tags.length === 0 && (
              <p className="text-sm text-gray-400">暂无标签</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
