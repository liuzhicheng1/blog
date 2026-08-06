import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import TagBadge from '@/components/TagBadge';
import { getArticles, getAllTags } from '@/lib/db';

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { tag } = await params;
  const sp = await searchParams;
  const page = parseInt(sp.page || '1', 10);
  const { articles, totalPages } = await getArticles(page, 10, tag);
  const tags = await getAllTags();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← 返回
            </Link>
            <h1 className="text-2xl font-bold">
              标签：<span className="text-blue-600">{tag}</span>
            </h1>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p>该标签下暂无文章</p>
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

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <Link
                  href={`/tag/${tag}?page=${page - 1}`}
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
                  href={`/tag/${tag}?page=${page + 1}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  下一页
                </Link>
              )}
            </div>
          )}
        </div>

        <aside className="w-56 shrink-0">
          <div className="sticky top-20">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              全部标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <TagBadge key={t.id} name={t.name} active={t.name === tag} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
