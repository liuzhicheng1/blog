'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from 'antd';
import App from 'antd/es/app';
import ImageUploader from '@/components/ImageUploader';

export default function AdminAboutPage() {
  const { message } = App.useApp();
  const [content, setContent] = useState('');
  const [savedContent, setSavedContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 内容与上次保存的一致时，保存按钮置灰
  const dirty = content !== savedContent;

  useEffect(() => {
    fetch('/api/about')
      .then((r) => r.json())
      .then((d) => {
        setContent(d.content || '');
        setSavedContent(d.content || '');
      })
      .catch(() => message.error('加载失败'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const insertAtCursor = useCallback((text: string) => {
    const el = textareaRef.current;
    if (!el) {
      setContent((prev) => prev + text);
      return;
    }
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    setContent((prev) => prev.slice(0, start) + text + prev.slice(end));
    setTimeout(() => {
      el.focus();
      const pos = start + text.length;
      el.setSelectionRange(pos, pos);
    }, 0);
  }, []);

  const handleImageUploaded = useCallback((url: string) => {
    insertAtCursor(`![image](${url})`);
  }, [insertAtCursor]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '保存失败');
      setSavedContent(content);
      message.success('保存成功');
    } catch (err: any) {
      message.error(err.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">关于页面</h1>
      <p className="text-sm text-gray-400 mb-4">
        使用 Markdown 编辑「关于我」页面，支持直接粘贴截图或点击下方上传图片
      </p>

      {loading ? (
        <p className="text-gray-400">加载中...</p>
      ) : (
        <>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={22}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder={'用 Markdown 写你的个人介绍，例如：\n\n## 你好，我是 xxx\n\n一名热爱技术的开发者...\n\n- 技术栈：TypeScript / React\n- GitHub：https://github.com/xxx'}
          />
          <div className="mt-2">
            <ImageUploader onImageUploaded={handleImageUploaded} />
          </div>
          <Button type="primary" onClick={save} loading={saving} disabled={!dirty} className="mt-4">
            {dirty ? '保存' : '已保存'}
          </Button>
        </>
      )}
    </div>
  );
}
