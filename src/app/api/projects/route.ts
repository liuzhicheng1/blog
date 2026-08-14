import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromCookie } from '@/lib/auth';
import { getProjects, createProject } from '@/lib/db';

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const user = await getAuthFromCookie();
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });

  try {
    const data = await request.json();
    const id = await createProject(data);
    return NextResponse.json({ id, success: true });
  } catch {
    return NextResponse.json({ error: '添加失败' }, { status: 500 });
  }
}
