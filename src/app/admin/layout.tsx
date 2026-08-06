import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import LogoutButton from './LogoutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('blog_admin_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = await verifyToken(token);
  if (!payload) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 shrink-0 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <Link href="/admin" className="text-lg font-bold text-gray-900">
            管理后台
          </Link>
          <p className="text-xs text-gray-400 mt-1">{payload.username}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin"
            className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            文章列表
          </Link>
          <Link
            href="/admin/articles/new"
            className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            写文章
          </Link>
          <Link
            href="/"
            className="block px-3 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-100 transition-colors"
            target="_blank"
          >
            查看博客 →
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <LogoutButton />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
