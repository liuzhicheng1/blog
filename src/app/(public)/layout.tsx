import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            我的博客
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              首页
            </Link>
            <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              管理
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} 我的博客. Powered by Next.js</p>
        </div>
      </footer>
    </div>
  );
}
