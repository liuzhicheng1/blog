import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import CommentSection from '@/components/CommentSection';
import TagBadge from '@/components/TagBadge';
import { getArticleBySlug } from '@/lib/db';

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mb-6 inline-block"
      >
        ← 返回首页
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {(article.tagList || article.tags.map((t: string) => ({ name: t, slug: t }))).map((tag) => (
            <TagBadge key={tag.name} name={tag.name} slug={tag.slug} />
          ))}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{article.title}</h1>
        <time className="text-gray-400 dark:text-gray-500">
          {new Date(article.created_at).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </header>

      {/* Content with TOC */}
      <MarkdownRenderer content={article.content} />

      {/* Comments */}
      <CommentSection articleId={article.id} />
    </div>
  );
}
