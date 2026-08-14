'use client';

import Link from 'next/link';
import { Card, Tag, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Text from 'antd/es/typography/Text';
import TagBadge from './TagBadge';
import type { TagInfo } from '@/lib/db';

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt: string;
  created_at: string;
  tags: string[];
  tagList?: TagInfo[];
}

export default function ArticleCard({ title, slug, excerpt, created_at, tags, tagList }: ArticleCardProps) {
  const list = tagList || tags.map((t) => ({ name: t, slug: t }));
  return (
    <Card hoverable className="!shadow-sm">
      <Space size={4} wrap className="mb-3">
        {list.map((tag) => (
          <TagBadge key={tag.name} name={tag.name} slug={tag.slug} />
        ))}
      </Space>
      <Link href={`/articles/${slug}`}>
        <Title level={4} style={{ marginTop: 0, marginBottom: 8 }}>
          {title}
        </Title>
      </Link>
      {excerpt && (
        <Paragraph type="secondary" ellipsis={{ rows: 3 }} style={{ marginBottom: 12 }}>
          {excerpt}
        </Paragraph>
      )}
      <Text type="secondary" style={{ fontSize: 14 }}>
        {new Date(created_at).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </Text>
    </Card>
  );
}
