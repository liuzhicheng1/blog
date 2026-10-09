'use client';

import Link from 'next/link';
import { Tag } from 'antd';

export default function TagBadge({
  name,
  slug,
  active = false,
  href,
}: {
  name: string;
  slug?: string;
  active?: boolean;
  href?: string;
}) {
  const link = href ?? (slug ? `/tag/${slug}` : `/tag/${name}`);
  return (
    <Link href={link}>
      <Tag color={active ? 'blue' : undefined} className="!m-0 !px-3 !py-0.5 cursor-pointer">
        {name}
      </Tag>
    </Link>
  );
}
