import { getAbout } from '@/lib/db';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const content = await getAbout();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">关于我</h1>
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8">
        {content ? (
          <MarkdownRenderer content={content} />
        ) : (
          <p className="text-gray-400 dark:text-gray-500">
            内容待完善，请到后台「关于页面」编辑。
          </p>
        )}
      </div>
    </div>
  );
}
