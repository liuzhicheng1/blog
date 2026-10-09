'use client';

import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Table, Popconfirm } from 'antd';
import App from 'antd/es/app';
import Title from 'antd/es/typography/Title';
import type { ColumnsType } from 'antd/es/table';

interface ProjectItem {
  id: number;
  name: string;
  url: string;
  description: string;
  tech_stack: string;
}

export default function AdminProjectsPage() {
  const { message } = App.useApp();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const loadProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data.projects || []);
    setLoading(false);
  };

  useEffect(() => { loadProjects(); }, []);

  const addProject = async (values: { name: string; url?: string; description?: string; tech_stack?: string }) => {
    const url = values.url?.trim() || '';
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: values.name.trim(),
        // 没写协议头的网址自动补 https://（内网地址请手动带 http://）
        url: url && !/^https?:\/\//i.test(url) ? `https://${url}` : url,
        description: values.description?.trim() || '',
        tech_stack: values.tech_stack?.trim() || '',
      }),
    });
    form.resetFields();
    message.success('添加成功');
    loadProjects();
  };

  const deleteProject = async (id: number) => {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    message.success('删除成功');
    loadProjects();
  };

  const columns: ColumnsType<ProjectItem> = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    {
      title: '链接',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
      render: (url: string) => url || '-',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (d: string) => d || '-',
    },
    {
      title: '技术栈',
      dataIndex: 'tech_stack',
      key: 'tech_stack',
      render: (t: string) => t || '-',
    },
    {
      title: '操作',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Popconfirm title="确定删除？" onConfirm={() => deleteProject(record.id)}>
          <Button type="link" danger size="small">删除</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginTop: 0, marginBottom: 24 }}>项目管理</Title>

      <Card className="!mb-6">
        <Form form={form} layout="inline" onFinish={addProject} style={{ rowGap: 12 }}>
          <Form.Item name="name" rules={[{ required: true, message: '请输入项目名称' }]} style={{ flex: 1, minWidth: 180 }}>
            <Input placeholder="项目名称" />
          </Form.Item>
          <Form.Item name="url" style={{ flex: 1, minWidth: 180 }}>
            <Input placeholder="项目链接（可选，支持内网地址）" />
          </Form.Item>
          <Form.Item name="description" style={{ flex: 1, minWidth: 180 }}>
            <Input placeholder="项目描述（可选）" />
          </Form.Item>
          <Form.Item name="tech_stack" style={{ flex: 1, minWidth: 180 }}>
            <Input placeholder="技术栈，逗号分隔如 React,TypeScript" />
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
          dataSource={projects}
          loading={loading}
          pagination={false}
          locale={{ emptyText: '暂无项目' }}
        />
      </Card>
    </div>
  );
}
