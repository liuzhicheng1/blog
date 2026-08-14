'use client';

import { Card, Empty, Row, Col } from 'antd';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Text from 'antd/es/typography/Text';
import type { LinkItem } from '@/lib/db';

export default function LinksClient({ links }: { links: LinkItem[] }) {
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
              <a href={link.url} target="_blank" rel="noopener noreferrer">
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
    </div>
  );
}
