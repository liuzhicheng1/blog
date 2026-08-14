'use client';

import Link from 'next/link';
import { Button, Empty, Pagination, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import Text from 'antd/es/typography/Text';
import ArticleCard from '@/components/ArticleCard';
import TagBadge from '@/components/TagBadge';
import type { TagInfo } from '@/lib/db';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  created_at: string;
  tags: string[];
  tagList?: TagInfo[];
}

export default function HomeClient({
  articles,
  totalPages,
  page,
  tags,
}: {
  articles: Article[];
  totalPages: number;
  page: number;
  tags: TagInfo[];
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <Title level={2} style={{ marginBottom: 32 }}>最新文章</Title>

          {articles.length === 0 ? (
            <Empty description="还没有文章">
              <Link href="/admin/articles/new">
                <Button type="primary">去写第一篇 →</Button>
              </Link>
            </Empty>
          ) : (
            <Space direction="vertical" size={16} className="w-full">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  slug={article.slug}
                  excerpt={article.excerpt}
                  created_at={article.created_at}
                  tags={article.tags}
                  tagList={article.tagList}
                />
              ))}
            </Space>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                current={page}
                total={totalPages * 10}
                pageSize={10}
                showSizeChanger={false}
                itemRender={(current, type, originalElement) => {
                  if (type === 'page') {
                    return <Link href={`/?page=${current}`}>{current}</Link>;
                  }
                  if (type === 'prev') {
                    return <Link href={`/?page=${Math.max(page - 1, 1)}`}>{originalElement}</Link>;
                  }
                  if (type === 'next') {
                    return <Link href={`/?page=${Math.min(page + 1, totalPages)}`}>{originalElement}</Link>;
                  }
                  return originalElement;
                }}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-56 shrink-0 hidden md:block">
          <div className="sticky top-20">
            <Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>标签</Title>
            <Space size={4} wrap>
              {tags.map((tag) => (
                <TagBadge key={tag.slug} name={tag.name} slug={tag.slug} />
              ))}
            </Space>
            {tags.length === 0 && (
              <Text type="secondary">暂无标签</Text>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
