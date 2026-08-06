import { NextResponse } from 'next/server';
import { getAuthFromCookie, removeAuthCookie } from '@/lib/auth';

export async function GET() {
  const user = await getAuthFromCookie();
  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }
  return NextResponse.json({ user: { id: user.userId, username: user.username } });
}

export async function DELETE() {
  await removeAuthCookie();
  return NextResponse.json({ message: '已退出登录' });
}
