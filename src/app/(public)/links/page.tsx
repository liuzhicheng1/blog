import { getLinks } from '@/lib/db';
import LinksClient from './LinksClient';

export default async function LinksPage() {
  const links = await getLinks();

  return <LinksClient links={links} />;
}
