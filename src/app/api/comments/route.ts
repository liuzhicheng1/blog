import { NextRequest, NextResponse } from 'next/server';
import { getCommentsByArticleId, createComment, getArticleById } from '@/lib/db';

// GET /api/comments?articleId=xxx
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const articleId = parseInt(searchParams.get('articleId') || '0', 10);

  if (!articleId) {
    return NextResponse.json({ error: '缺少文章ID' }, { status: 400 });
  }

  const comments = await getCommentsByArticleId(articleId);
  return NextResponse.json({ comments });
}

// POST /api/comments
export async function POST(request: NextRequest) {
  try {
    const { articleId, authorName, content } = await request.json();

    if (!articleId || !authorName || !content) {
      return NextResponse.json({ error: '请填写完整信息' }, { status: 400 });
    }

    const article = await getArticleById(articleId);
    if (!article) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    const comment = await createComment(articleId, authorName, content);
    return NextResponse.json({ comment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: '评论失败' }, { status: 500 });
  }
}
