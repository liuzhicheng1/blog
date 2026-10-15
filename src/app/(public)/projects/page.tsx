import { getProjects } from '@/lib/db';
import ProjectsClient from './ProjectsClient';

// 后台可随时增删项目，页面必须每次请求动态渲染，不能构建时固化
export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return <ProjectsClient projects={projects} />;
}
