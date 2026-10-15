import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

// seed script always runs with DATABASE_URL set, so direct init is fine
const sql = neon(process.env.DATABASE_URL!);

async function main() {
  // Create tables
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL,
      excerpt TEXT DEFAULT '',
      published BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS tags (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS article_tags (
      article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
      tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (article_id, tag_id)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
      author_name TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS links (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      description TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      approved BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // 访客申请友链需要审核标记，老表补列（已存在的友链默认视为已上架）
  await sql`
    ALTER TABLE links ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT true;
  `;
  // 拒绝标记：不通过的申请保留数据，不直接删除
  await sql`
    ALTER TABLE links ADD COLUMN IF NOT EXISTS rejected BOOLEAN NOT NULL DEFAULT false;
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      url TEXT DEFAULT '',
      description TEXT DEFAULT '',
      tech_stack TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS about_page (
      id SERIAL PRIMARY KEY,
      content TEXT DEFAULT '',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  console.log('✅ Database tables created');

  // Create admin user
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await sql`SELECT id FROM users WHERE username = ${username}`;
  if (existing.length === 0) {
    const hash = bcrypt.hashSync(password, 10);
    await sql`INSERT INTO users (username, password_hash) VALUES (${username}, ${hash})`;
    console.log(`✅ Admin user created: ${username}`);
  } else {
    console.log(`ℹ️  Admin user already exists: ${username}`);
  }

  console.log('✅ Database initialized successfully');
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
