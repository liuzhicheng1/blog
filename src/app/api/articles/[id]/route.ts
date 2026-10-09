import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromCookie } from '@/lib/auth';
import { getArticleById, updateArticle, deleteArticle } from '@/lib/db';

// GET /api/articles/[id] — public, get single article (published only)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = await getArticleById(parseInt(id, 10));
  if (!article || !article.published) {
    return NextResponse.json({ error: '文章不存在' }, { status: 404 });
  }
  return NextResponse.json({ article });
}

// PUT /api/articles/[id] — admin only, update article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthFromCookie();
  if (!user) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const { id } = await params;
  const articleId = parseInt(id, 10);

  try {
    const data = await request.json();
    const article = await updateArticle(articleId, data);
    if (!article) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }
    return NextResponse.json({ article });
  } catch (error) {
    console.error('Update article error:', error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `更新文章失败：${detail}` }, { status: 500 });
  }
}

// DELETE /api/articles/[id] — admin only, delete article
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthFromCookie();
  if (!user) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const { id } = await params;
  const articleId = parseInt(id, 10);

  const existing = await getArticleById(articleId);
  if (!existing) {
    return NextResponse.json({ error: '文章不存在' }, { status: 404 });
  }

  await deleteArticle(articleId);
  return NextResponse.json({ message: '文章已删除' });
}
