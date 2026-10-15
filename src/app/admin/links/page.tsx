'use client';

import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Table, Popconfirm, Modal, Space, Tag } from 'antd';
import App from 'antd/es/app';
import Title from 'antd/es/typography/Title';
import type { ColumnsType } from 'antd/es/table';

interface LinkItem {
  id: number;
  name: string;
  url: string;
  description: string;
  approved: boolean;
  rejected: boolean;
}

export default function AdminLinksPage() {
  const { message } = App.useApp();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editing, setEditing] = useState<LinkItem | null>(null);
  // 正在执行审核操作的友链 id：对应按钮转 loading，其余操作临时禁用，防止重复点击
  const [operatingId, setOperatingId] = useState<number | null>(null);
  const busy = operatingId !== null;

  const openEdit = (record: LinkItem) => {
    setEditing(record);
    editForm.setFieldsValue({
      name: record.name,
      url: record.url,
      description: record.description,
    });
  };

  const handleEditSubmit = async (values: { name: string; url: string; description?: string }) => {
    if (!editing) return;
    setSaving(true);
    try {
      const url = values.url.trim();
      const res = await fetch(`/api/links/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          // 没写协议头的网址自动补 https://，避免被浏览器当成站内相对路径
          url: /^https?:\/\//i.test(url) ? url : `https://${url}`,
          description: values.description?.trim() || '',
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '更新失败');
      }
      message.success('更新成功');
      setEditing(null);
      loadLinks();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '更新失败');
    } finally {
      setSaving(false);
    }
  };

  const loadLinks = async () => {
    // 管理端加载全部（含待审核）
    const res = await fetch('/api/links?all=1');
    const data = await res.json();
    setLinks(data.links || []);
    setLoading(false);
  };

  // 审核通过：上架展示（已拒绝的也可恢复）
  const approveLink = async (id: number) => {
    setOperatingId(id);
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true }),
      });
      if (res.ok) {
        message.success('已通过并上架');
        loadLinks();
      } else {
        message.error('操作失败');
      }
    } finally {
      setOperatingId(null);
    }
  };

  // 审核不通过：保留数据，仅标记为已拒绝
  const rejectLink = async (id: number) => {
    setOperatingId(id);
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejected: true }),
      });
      if (res.ok) {
        message.success('已标记为不通过');
        loadLinks();
      } else {
        message.error('操作失败');
      }
    } finally {
      setOperatingId(null);
    }
  };

  useEffect(() => { loadLinks(); }, []);

  const addLink = async (values: { name: string; url: string; description?: string }) => {
    const url = values.url.trim();
    await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: values.name.trim(),
        // 没写协议头的网址自动补 https://，避免被浏览器当成站内相对路径
        url: /^https?:\/\//i.test(url) ? url : `https://${url}`,
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
      title: '状态',
      key: 'status',
      width: 90,
      render: (_, record) =>
        record.approved ? (
          <Tag color="green">已上架</Tag>
        ) : record.rejected ? (
          <Tag>已拒绝</Tag>
        ) : (
          <Tag color="orange">待审核</Tag>
        ),
    },
    {
      title: '操作',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Space size={0}>
          {!record.approved && !record.rejected && (
            <>
              <Button
                type="link"
                size="small"
                loading={operatingId === record.id}
                disabled={busy && operatingId !== record.id}
                onClick={() => approveLink(record.id)}
              >
                通过
              </Button>
              <Popconfirm title="不通过该申请？数据将保留为已拒绝状态" okText="不通过" onConfirm={() => rejectLink(record.id)}>
                <Button
                  type="link"
                  danger
                  size="small"
                  loading={operatingId === record.id}
                  disabled={busy && operatingId !== record.id}
                >
                  不通过
                </Button>
              </Popconfirm>
            </>
          )}
          {record.rejected && (
            <Button
              type="link"
              size="small"
              loading={operatingId === record.id}
              disabled={busy && operatingId !== record.id}
              onClick={() => approveLink(record.id)}
            >
              恢复通过
            </Button>
          )}
          <Button type="link" size="small" disabled={busy} onClick={() => openEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => deleteLink(record.id)}>
            <Button type="link" danger size="small" disabled={busy}>删除</Button>
          </Popconfirm>
        </Space>
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

      <Modal
        title="编辑友链"
        open={!!editing}
        onCancel={() => setEditing(null)}
        footer={null}
        // 提前挂载内容，保证 editForm 始终连接到 Form 元素，消除 useForm 未连接警告
        forceRender
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item name="name" label="网站名称" rules={[{ required: true, message: '请输入网站名称' }]}>
            <Input placeholder="网站名称" />
          </Form.Item>
          <Form.Item name="url" label="网址" rules={[{ required: true, message: '请输入网址' }]}>
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="description" label="简介">
            <Input placeholder="简介（可选）" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setEditing(null)}>取消</Button>
            <Button type="primary" htmlType="submit" loading={saving}>保存</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
