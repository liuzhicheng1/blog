import Link from 'next/link';
import TagBadge from './TagBadge';

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt: string;
  created_at: string;
  tags: string[];
}

export default function ArticleCard({ title, slug, excerpt, created_at, tags }: ArticleCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag) => (
          <TagBadge key={tag} name={tag} />
        ))}
      </div>
      <Link href={`/articles/${slug}`}>
        <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
          {title}
        </h2>
      </Link>
      {excerpt && <p className="text-gray-600 mb-3 line-clamp-3">{excerpt}</p>}
      <time className="text-sm text-gray-400">
        {new Date(created_at).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </time>
    </article>
  );
}
