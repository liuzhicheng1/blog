'use client';

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const toc = useMemo(() => {
    const items: TOCItem[] = [];
    const regex = /^(#{2,3})\s+(.+)$/gm;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      items.push({ id, text, level });
    }
    return items;
  }, [content]);

  return (
    <div className="flex gap-8">
      {/* TOC Sidebar */}
      {toc.length > 2 && (
        <aside className="hidden xl:block w-56 shrink-0">
          <nav className="sticky top-20">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              目录
            </h4>
            <ul className="space-y-1 border-l-2 border-gray-200">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`block text-sm py-0.5 transition-colors hover:text-blue-600 ${
                      item.level === 2
                        ? 'pl-3 text-gray-600'
                        : 'pl-6 text-gray-400 text-xs'
                    }`}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}

      {/* Article content */}
      <div className="min-w-0 flex-1">
        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-pink-600 prose-code:bg-gray-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#1e293b] prose-pre:text-[#e2e8f0] prose-blockquote:border-blue-500 prose-blockquote:text-gray-600 dark:prose-headings:text-gray-100 dark:prose-p:text-gray-300 dark:prose-strong:text-gray-100 dark:prose-code:bg-gray-800 dark:prose-code:text-pink-400 dark:prose-blockquote:text-gray-400 dark:prose-blockquote:border-blue-400">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children, ...props }) => {
                const text = String(children);
                const id = text
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, '')
                  .replace(/\s+/g, '-');
                return <h2 id={id} {...props}>{children}</h2>;
              },
              h3: ({ children, ...props }) => {
                const text = String(children);
                const id = text
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, '')
                  .replace(/\s+/g, '-');
                return <h3 id={id} {...props}>{children}</h3>;
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
