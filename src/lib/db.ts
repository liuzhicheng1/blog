import { neon } from '@neondatabase/serverless';

let _sql: any = null;

function sql(strings: TemplateStringsArray, ...values: any[]) {
  if (!_sql) {
    _sql = neon(process.env.DATABASE_URL!);
  }
  return _sql(strings, ...values) as any;
}

// --- Helpers ---

export function slugify(text: string): string {
  let slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  // 中文标题过滤后为空，用时间戳兜底
  if (!slug) {
    slug = 'post-' + Date.now();
  }
  return slug;
}

// --- Schema initialization ---

export async function initSchema() {
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
}

// --- User ---

export async function getUserByUsername(username: string) {
  const rows = await sql`SELECT * FROM users WHERE username = ${username}`;
  return rows[0] as { id: number; username: string; password_hash: string } | undefined;
}

export async function createUser(username: string, passwordHash: string) {
  const rows = await sql`
    INSERT INTO users (username, password_hash)
    VALUES (${username}, ${passwordHash})
    RETURNING id
  `;
  return rows[0];
}

// --- Article ---

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ArticleWithTags extends Article {
  tags: string[];
}

export async function getArticles(page: number = 1, limit: number = 10, tag?: string) {
  const offset = (page - 1) * limit;

  let countResult;
  let articles;

  if (tag) {
    countResult = await sql`
      SELECT COUNT(*) as total FROM articles a
      WHERE a.published = true
      AND a.id IN (
        SELECT at2.article_id FROM article_tags at2
        JOIN tags t2 ON at2.tag_id = t2.id WHERE t2.slug = ${tag}
      )
    `;
    articles = await sql`
      SELECT a.*, STRING_AGG(t.name, ',') as tag_names
      FROM articles a
      LEFT JOIN article_tags at ON a.id = at.article_id
      LEFT JOIN tags t ON at.tag_id = t.id
      WHERE a.published = true
      AND a.id IN (
        SELECT at2.article_id FROM article_tags at2
        JOIN tags t2 ON at2.tag_id = t2.id WHERE t2.slug = ${tag}
      )
      GROUP BY a.id
      ORDER BY a.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else {
    countResult = await sql`SELECT COUNT(*) as total FROM articles WHERE published = true`;
    articles = await sql`
      SELECT a.*, STRING_AGG(t.name, ',') as tag_names
      FROM articles a
      LEFT JOIN article_tags at ON a.id = at.article_id
      LEFT JOIN tags t ON at.tag_id = t.id
      WHERE a.published = true
      GROUP BY a.id
      ORDER BY a.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  }

  const total = parseInt(countResult[0].total, 10);
  const formatted = articles.map((a: any) => ({
    ...a,
    tags: a.tag_names ? a.tag_names.split(',') : [],
    tag_names: undefined,
  }));

  return {
    articles: formatted as ArticleWithTags[],
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getArticleBySlug(slug: string) {
  const rows = await sql`
    SELECT a.*, STRING_AGG(t.name, ',') as tag_names
    FROM articles a
    LEFT JOIN article_tags at ON a.id = at.article_id
    LEFT JOIN tags t ON at.tag_id = t.id
    WHERE a.slug = ${slug} AND a.published = true
    GROUP BY a.id
  `;

  if (rows.length === 0) return null;
  const article = rows[0] as any;
  return {
    ...article,
    tags: article.tag_names ? article.tag_names.split(',') : [],
    tag_names: undefined,
  } as ArticleWithTags;
}

export async function getArticleById(id: number) {
  const rows = await sql`
    SELECT a.*, STRING_AGG(t.name, ',') as tag_names
    FROM articles a
    LEFT JOIN article_tags at ON a.id = at.article_id
    LEFT JOIN tags t ON at.tag_id = t.id
    WHERE a.id = ${id}
    GROUP BY a.id
  `;

  if (rows.length === 0) return null;
  const article = rows[0] as any;
  return {
    ...article,
    tags: article.tag_names ? article.tag_names.split(',') : [],
    tag_names: undefined,
  } as ArticleWithTags;
}

export async function createArticle(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published?: number;
  tags?: string[];
}) {
  const { title, slug, content, excerpt = '', published = 0, tags = [] } = data;

  const result = await sql`
    INSERT INTO articles (title, slug, content, excerpt, published)
    VALUES (${title}, ${slug}, ${content}, ${excerpt}, ${published === 1})
    RETURNING id
  `;
  const articleId = result[0].id as number;

  for (const tagName of tags) {
    const tagSlug = slugify(tagName);
    const existingTag = await sql`SELECT id FROM tags WHERE slug = ${tagSlug}`;
    let tagId: number;
    if (existingTag.length > 0) {
      tagId = existingTag[0].id;
    } else {
      const newTag = await sql`
        INSERT INTO tags (name, slug) VALUES (${tagName}, ${tagSlug}) RETURNING id
      `;
      tagId = newTag[0].id;
    }
    await sql`
      INSERT INTO article_tags (article_id, tag_id) VALUES (${articleId}, ${tagId})
      ON CONFLICT DO NOTHING
    `;
  }

  return getArticleById(articleId);
}

export async function updateArticle(
  id: number,
  data: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    published?: number;
    tags?: string[];
  }
) {
  const article = await getArticleById(id);
  if (!article) return null;

  // Update scalar fields
  if (data.title !== undefined) {
    await sql`UPDATE articles SET title = ${data.title} WHERE id = ${id}`;
  }
  if (data.slug !== undefined) {
    await sql`UPDATE articles SET slug = ${data.slug} WHERE id = ${id}`;
  }
  if (data.content !== undefined) {
    await sql`UPDATE articles SET content = ${data.content} WHERE id = ${id}`;
  }
  if (data.excerpt !== undefined) {
    await sql`UPDATE articles SET excerpt = ${data.excerpt} WHERE id = ${id}`;
  }
  if (data.published !== undefined) {
    await sql`UPDATE articles SET published = ${data.published === 1} WHERE id = ${id}`;
  }

  await sql`UPDATE articles SET updated_at = NOW() WHERE id = ${id}`;

  // Handle tags
  if (data.tags !== undefined) {
    await sql`DELETE FROM article_tags WHERE article_id = ${id}`;
    for (const tagName of data.tags) {
      const tagSlug = slugify(tagName);
      const existingTag = await sql`SELECT id FROM tags WHERE slug = ${tagSlug}`;
      let tagId: number;
      if (existingTag.length > 0) {
        tagId = existingTag[0].id;
      } else {
        const newTag = await sql`
          INSERT INTO tags (name, slug) VALUES (${tagName}, ${tagSlug}) RETURNING id
        `;
        tagId = newTag[0].id;
      }
      await sql`
        INSERT INTO article_tags (article_id, tag_id) VALUES (${id}, ${tagId})
        ON CONFLICT DO NOTHING
      `;
    }
  }

  return getArticleById(id);
}

export async function deleteArticle(id: number) {
  await sql`DELETE FROM articles WHERE id = ${id}`;
}

export async function getAllArticlesForAdmin(page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;
  const countResult = await sql`SELECT COUNT(*) as total FROM articles`;
  const total = parseInt(countResult[0].total, 10);

  const articles = await sql`
    SELECT a.*, STRING_AGG(t.name, ',') as tag_names
    FROM articles a
    LEFT JOIN article_tags at ON a.id = at.article_id
    LEFT JOIN tags t ON at.tag_id = t.id
    GROUP BY a.id
    ORDER BY a.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const formatted = articles.map((a: any) => ({
    ...a,
    tags: a.tag_names ? a.tag_names.split(',') : [],
    tag_names: undefined,
  }));

  return {
    articles: formatted as ArticleWithTags[],
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// --- Tags ---

export async function getAllTags() {
  const rows = await sql`
    SELECT t.*, COUNT(at.article_id)::int as article_count
    FROM tags t
    LEFT JOIN article_tags at ON t.id = at.tag_id
    LEFT JOIN articles a ON at.article_id = a.id AND a.published = true
    GROUP BY t.id
    HAVING COUNT(at.article_id) > 0
    ORDER BY article_count DESC
  `;
  return rows as { id: number; name: string; slug: string; article_count: number }[];
}

// --- Comments ---

export async function getCommentsByArticleId(articleId: number) {
  const rows = await sql`
    SELECT * FROM comments
    WHERE article_id = ${articleId}
    ORDER BY created_at DESC
  `;
  return rows as {
    id: number;
    article_id: number;
    author_name: string;
    content: string;
    created_at: string;
  }[];
}

export async function createComment(articleId: number, authorName: string, content: string) {
  const result = await sql`
    INSERT INTO comments (article_id, author_name, content)
    VALUES (${articleId}, ${authorName}, ${content})
    RETURNING id, created_at
  `;
  return {
    id: result[0].id,
    article_id: articleId,
    author_name: authorName,
    content,
    created_at: result[0].created_at,
  };
}
