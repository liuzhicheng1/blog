import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromCookie } from '@/lib/auth';
import { getLinks, getAllLinksForAdmin, createLink } from '@/lib/db';

// GET /api/links — 公开返回已上架友链；管理员加 ?all=1 返回全部（含待审核）
export async function GET(request: NextRequest) {
  const all = request.nextUrl.searchParams.get('all') === '1';
  if (all) {
    const user = await getAuthFromCookie();
    if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });
    const links = await getAllLinksForAdmin();
    return NextResponse.json({ links });
  }
  const links = await getLinks();
  return NextResponse.json({ links });
}

export async function POST(request: NextRequest) {
  const user = await getAuthFromCookie();
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  try {
    const data = await request.json();
    const id = await createLink(data);
    return NextResponse.json({ id, success: true });
  } catch {
    return NextResponse.json({ error: '添加失败' }, { status: 500 });
  }
}
