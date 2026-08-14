import { getArticles, getAllTags } from '@/lib/db';
import HomeClient from './HomeClient';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const { articles, totalPages } = await getArticles(page, 10);
  const tags = await getAllTags();

  return <HomeClient articles={articles} totalPages={totalPages} page={page} tags={tags} />;
}
