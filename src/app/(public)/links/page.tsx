import { getLinks } from '@/lib/db';
import LinksClient from './LinksClient';

// 后台可随时增删友链，页面必须每次请求动态渲染，不能构建时固化
export const dynamic = 'force-dynamic';

export default async function LinksPage() {
  const links = await getLinks();

  return <LinksClient links={links} />;
}
