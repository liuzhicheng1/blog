'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
}

export default function ImageUploader({ onImageUploaded }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [done, setDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    setDone(false);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '上传失败');
      if (!data.url) throw new Error('服务端未返回图片地址');
      onImageUploaded(data.url);
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch (err: any) {
      alert(err.message || '上传失败');
    } finally {
      setUploading(false);
    }
  }, [onImageUploaded]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors text-sm ${
          dragOver
            ? 'border-blue-400 bg-blue-50 text-blue-600'
            : done
            ? 'border-green-400 bg-green-50 text-green-600'
            : 'border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {uploading ? '上传中...' : done ? '✓ 已插入图片' : '点击或拖拽图片到此处上传'}
      </div>
    </div>
  );
}
