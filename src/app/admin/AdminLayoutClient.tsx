'use client';

import Link from 'next/link';
import { Layout, Menu } from 'antd';
import Title from 'antd/es/typography/Title';
import Text from 'antd/es/typography/Text';
import {
  FileTextOutlined,
  EditOutlined,
  LinkOutlined,
  ProjectOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import LogoutButton from './LogoutButton';

const { Sider, Content } = Layout;

export default function AdminLayoutClient({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const menuItems = [
    { key: '/admin', icon: <FileTextOutlined />, label: <Link href="/admin">文章列表</Link> },
    { key: '/admin/articles/new', icon: <EditOutlined />, label: <Link href="/admin/articles/new">写文章</Link> },
    { type: 'divider' as const },
    { key: '/admin/links', icon: <LinkOutlined />, label: <Link href="/admin/links">友链管理</Link> },
    { key: '/admin/projects', icon: <ProjectOutlined />, label: <Link href="/admin/projects">项目管理</Link> },
    { type: 'divider' as const },
    { key: 'blog', icon: <HomeOutlined />, label: <Link href="/" target="_blank">查看博客 →</Link> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} theme="light" breakpoint="lg" collapsedWidth={0}>
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={5} style={{ margin: 0 }}>管理后台</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>{username}</Text>
        </div>
        <Menu mode="inline" defaultSelectedKeys={['/admin']} items={menuItems} style={{ borderInlineEnd: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '16px', borderTop: '1px solid #f0f0f0' }}>
          <LogoutButton />
        </div>
      </Sider>
      <Content style={{ padding: 24 }}>
        {children}
      </Content>
    </Layout>
  );
}
