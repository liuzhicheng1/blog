'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/me', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors text-left"
    >
      退出登录
    </button>
  );
}
