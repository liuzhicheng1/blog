import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeProvider';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* 左侧装饰图（暂时隐藏，需要时取消注释；图片在 public/side-bg.jpg）
      <div
        aria-hidden
        className="hidden xl:block fixed left-0 top-0 w-[calc((100vw-896px)/2)] pointer-events-none"
      >
        <img src="/side-bg.jpg" alt="" className="w-full h-auto select-none" />
      </div>
      */}

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 transition-colors">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            橙子的博客
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
              首页
            </Link>
            <Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
              关于
            </Link>
            <Link href="/links" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
              友链
            </Link>
            <Link href="/projects" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
              项目
            </Link>
            <Link href="/admin" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              管理
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16 transition-colors">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-gray-400 dark:text-gray-500">
          <p>&copy; {new Date().getFullYear()} 我的博客. Powered by Next.js</p>
        </div>
      </footer>
    </div>
  );
}
