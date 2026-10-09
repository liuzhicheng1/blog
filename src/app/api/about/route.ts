import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromCookie } from '@/lib/auth';
import { getAbout, upsertAbout } from '@/lib/db';

// GET /api/about — public
export async function GET() {
  try {
    const content = await getAbout();
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Get about error:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}

// PUT /api/about — admin only
export async function PUT(request: NextRequest) {
  const user = await getAuthFromCookie();
  if (!user) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  try {
    const { content } = await request.json();
    if (typeof content !== 'string') {
      return NextResponse.json({ error: '内容格式错误' }, { status: 400 });
    }
    await upsertAbout(content);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update about error:', error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `保存失败：${detail}` }, { status: 500 });
  }
}
