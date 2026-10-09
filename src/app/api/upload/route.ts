import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromCookie } from '@/lib/auth';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  const user = await getAuthFromCookie();
  if (!user) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  // 线上走 OIDC（BLOB_STORE_ID + VERCEL_OIDC_TOKEN），本地走 BLOB_READ_WRITE_TOKEN
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    console.error('Upload error: 未检测到 Blob 凭证（BLOB_READ_WRITE_TOKEN 或 BLOB_STORE_ID）');
    return NextResponse.json({ error: '服务端未配置 Blob 存储' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: '没有上传文件' }, { status: 400 });
    }

    // 限制文件类型
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: '不支持的文件类型' }, { status: 400 });
    }

    // 限制大小 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: '文件大小不能超过 10MB' }, { status: 400 });
    }

    // 生成唯一文件名（保留原扩展名）
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const dateDir = new Date().toISOString().slice(0, 7).replace('-', '/');
    const pathname = `uploads/${dateDir}/${crypto.randomUUID()}.${ext}`;

    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({ url: blob.url, success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Upload error:', error);
    return NextResponse.json({ error: `上传失败：${message}` }, { status: 500 });
  }
}
