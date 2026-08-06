import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken, setAuthCookie } from '@/lib/auth';
import { getUserByUsername } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: '用户名和密码不能为空' }, { status: 400 });
    }

    const user = await getUserByUsername(username);
    if (!user) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
    }

    const token = await signToken({ userId: user.id, username: user.username });
    await setAuthCookie(token);

    return NextResponse.json({ message: '登录成功', user: { id: user.id, username: user.username } });
  } catch {
    return NextResponse.json({ error: '登录失败' }, { status: 500 });
  }
}
