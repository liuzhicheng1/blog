import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromCookie } from '@/lib/auth';
import { updateLink, deleteLink } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthFromCookie();
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  try {
    const { id } = await params;
    const data = await request.json();
    await updateLink(parseInt(id, 10), data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '更新失败' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthFromCookie();
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  try {
    const { id } = await params;
    await deleteLink(parseInt(id, 10));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '删除失败' }, { status: 500 });
  }
}
