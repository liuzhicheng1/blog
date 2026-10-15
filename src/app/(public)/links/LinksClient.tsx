'use client';

import { useState } from 'react';
import { Card, Empty, Row, Col, Form, Input, Button, App, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Text from 'antd/es/typography/Text';
import type { LinkItem } from '@/lib/db';

// 没写协议头的网址自动补 https://，避免被浏览器当成站内相对路径
function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed || /^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function LinksClient({ links }: { links: LinkItem[] }) {
  const { message } = App.useApp();
  const [applyForm] = Form.useForm();
  const [applyOpen, setApplyOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleApply = async (values: { name: string; url: string; description?: string }) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/links/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          url: values.url.trim(),
          description: values.description?.trim() || '',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '提交失败');
      message.success('申请已提交，等待站长审核');
      setApplyOpen(false);
      applyForm.resetFields();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Title level={2} style={{ marginBottom: 4 }}>友情链接</Title>
      <Paragraph type="secondary" style={{ marginBottom: 32 }}>
        欢迎交换友链，一起交流学习
      </Paragraph>

      {links.length === 0 ? (
        <Empty description="暂无友链" />
      ) : (
        <Row gutter={[16, 16]}>
          {links.map((link) => (
            <Col xs={24} sm={12} key={link.id}>
              <a href={normalizeUrl(link.url)} target="_blank" rel="noopener noreferrer">
                <Card hoverable>
                  <Title level={5} style={{ marginTop: 0, marginBottom: 4 }}>{link.name}</Title>
                  {link.description && (
                    <Text type="secondary">{link.description}</Text>
                  )}
                </Card>
              </a>
            </Col>
          ))}
        </Row>
      )}

      <div className="mt-10">
        <Button
          type="dashed"
          block
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setApplyOpen(true)}
        >
          申请友链
        </Button>
      </div>

      <Modal
        title="申请友链"
        open={applyOpen}
        onCancel={() => setApplyOpen(false)}
        footer={null}
        // 提前挂载内容，保证 applyForm 始终连接到 Form 元素，消除 useForm 未连接警告
        forceRender
      >
        <Paragraph type="secondary" style={{ marginTop: 0 }}>
          填写下方信息提交申请，站长审核通过后会展示在友链页面。
        </Paragraph>
        <Form form={applyForm} layout="vertical" onFinish={handleApply}>
          <Form.Item name="name" label="网站名称" rules={[{ required: true, message: '请输入网站名称' }]}>
            <Input placeholder="你的网站名称" maxLength={50} />
          </Form.Item>
          <Form.Item
            name="url"
            label="网址"
            rules={[
              { required: true, message: '请输入网址' },
              { type: 'url', message: '请输入合法网址' },
            ]}
          >
            <Input placeholder="https://example.com" maxLength={300} />
          </Form.Item>
          <Form.Item name="description" label="网站简介" rules={[{ max: 200, message: '简介不能超过 200 字' }]}>
            <Input.TextArea rows={2} placeholder="一句话介绍你的网站（可选）" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setApplyOpen(false)}>取消</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>提交申请</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
