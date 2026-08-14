import { Card, Empty, Tag, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import { getProjects } from '@/lib/db';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Title level={2} style={{ marginBottom: 4 }}>项目作品</Title>
      <Paragraph type="secondary" style={{ marginBottom: 32 }}>
        我做过的一些项目
      </Paragraph>

      {projects.length === 0 ? (
        <Empty description="暂无项目" />
      ) : (
        <Space direction="vertical" size={16} className="w-full">
          {projects.map((project) => (
            <Card key={project.id}>
              <Title level={4} style={{ marginTop: 0, marginBottom: 4 }}>
                {project.url ? (
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    {project.name}
                  </a>
                ) : (
                  project.name
                )}
              </Title>
              {project.description && (
                <Paragraph type="secondary" style={{ marginBottom: 12 }}>
                  {project.description}
                </Paragraph>
              )}
              {project.tech_stack && (
                <Space size={4} wrap>
                  {project.tech_stack.split(',').map((tech) => (
                    <Tag key={tech.trim()} color="blue">{tech.trim()}</Tag>
                  ))}
                </Space>
              )}
            </Card>
          ))}
        </Space>
      )}
    </div>
  );
}
