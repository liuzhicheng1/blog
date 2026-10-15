import { NextRequest, NextResponse } from 'next/server';
import { createLinkApplication } from '@/lib/db';

// POST /api/links/apply — 公开接口：访客自助申请友链（进入待审核，不直接公开）
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const name = String(data.name || '').trim();
    const url = String(data.url || '').trim();
    const description = String(data.description || '').trim();

    if (!name || !url) {
      return NextResponse.json({ error: '网站名称和网址不能为空' }, { status: 400 });
    }
    if (name.length > 50 || url.length > 300 || description.length > 200) {
      return NextResponse.json({ error: '内容超出长度限制' }, { status: 400 });
    }
    // 简单格式校验：至少像个网址（域名.后缀），没协议头自动补
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    if (!/^https?:\/\/[^\s]+\.[^\s]+/i.test(normalized)) {
      return NextResponse.json({ error: '网址格式不正确' }, { status: 400 });
    }

    const { duplicated } = await createLinkApplication({
      name,
      url: normalized,
      description,
    });

    if (duplicated) {
      return NextResponse.json({ error: '该网址已存在（或正在审核中）' }, { status: 409 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Link apply error:', error);
    return NextResponse.json({ error: '提交失败' }, { status: 500 });
  }
}
