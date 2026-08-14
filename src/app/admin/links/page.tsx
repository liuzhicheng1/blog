'use client';

import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Table, Popconfirm, message } from 'antd';
import Title from 'antd/es/typography/Title';
import type { ColumnsType } from 'antd/es/table';

interface LinkItem {
  id: number;
  name: string;
  url: string;
  description: string;
}

export default function AdminLinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const loadLinks = async () => {
    const res = await fetch('/api/links');
    const data = await res.json();
    setLinks(data.links || []);
    setLoading(false);
  };

  useEffect(() => { loadLinks(); }, []);

  const addLink = async (values: { name: string; url: string; description?: string }) => {
    await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: values.name.trim(),
        url: values.url.trim(),
        description: values.description?.trim() || '',
      }),
    });
    form.resetFields();
    message.success('添加成功');
    loadLinks();
  };

  const deleteLink = async (id: number) => {
    await fetch(`/api/links/${id}`, { method: 'DELETE' });
    message.success('删除成功');
    loadLinks();
  };

  const columns: ColumnsType<LinkItem> = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    {
      title: '网址',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
      ),
    },
    {
      title: '简介',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (d: string) => d || '-',
    },
    {
      title: '操作',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Popconfirm title="确定删除？" onConfirm={() => deleteLink(record.id)}>
          <Button type="link" danger size="small">删除</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginTop: 0, marginBottom: 24 }}>友链管理</Title>

      <Card className="!mb-6">
        <Form form={form} layout="inline" onFinish={addLink} style={{ rowGap: 12 }}>
          <Form.Item name="name" rules={[{ required: true, message: '请输入网站名称' }]} style={{ flex: 1, minWidth: 160 }}>
            <Input placeholder="网站名称" />
          </Form.Item>
          <Form.Item
            name="url"
            rules={[
              { required: true, message: '请输入网址' },
              { type: 'url', message: '请输入合法网址' },
            ]}
            style={{ flex: 2, minWidth: 220 }}
          >
            <Input placeholder="网址 https://..." />
          </Form.Item>
          <Form.Item name="description" style={{ flex: 1, minWidth: 160 }}>
            <Input placeholder="简介（可选）" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">添加</Button>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={links}
          loading={loading}
          pagination={false}
          locale={{ emptyText: '暂无友链' }}
        />
      </Card>
    </div>
  );
}
