import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromCookie } from '@/lib/auth';
import { getArticles as getDbArticles, createArticle, slugify } from '@/lib/db';

// GET /api/articles — public, list published articles
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const tag = searchParams.get('tag') || undefined;

  const result = await getDbArticles(page, limit, tag);
  return NextResponse.json(result);
}

// POST /api/articles — admin only, create article
export async function POST(request: NextRequest) {
  const user = await getAuthFromCookie();
  if (!user) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  try {
    const { title, content, excerpt, published, tags } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
    }

    const slug = slugify(title);
    const article = await createArticle({ title, slug, content, excerpt, published, tags });
    return NextResponse.json({ article }, { status: 201 });
  } catch (error: any) {
    if (error?.code === '23505') {
      return NextResponse.json({ error: '文章标题已存在，请更换标题' }, { status: 409 });
    }
    return NextResponse.json({ error: '创建文章失败' }, { status: 500 });
  }
}
