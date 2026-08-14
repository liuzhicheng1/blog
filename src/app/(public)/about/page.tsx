export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">关于我</h1>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 space-y-6">
        {/* 头像和基本信息 */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            B
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">博客主</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">全栈工程师 / 终身学习者</p>
          </div>
        </div>

        {/* 个人简介 */}
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
          <p>
            你好！我是一名热爱技术的程序员。这个博客用于记录我在软件开发、系统设计和技术探索中的思考与实践。
          </p>
          <p>
            工作之余，我喜欢研究新技术、阅读开源代码，偶尔也会写一些技术文章分享给社区。
          </p>
        </div>

        {/* 技术栈 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">技术栈</h3>
          <div className="flex flex-wrap gap-2">
            {[
              'TypeScript', 'React', 'Next.js', 'Node.js',
              'PostgreSQL', 'Tailwind CSS', 'Docker', 'Git'
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* 联系方式 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">联系方式</h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <span className="font-medium text-gray-700 dark:text-gray-300">GitHub: </span>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                github.com/yourname
              </a>
            </p>
            <p>
              <span className="font-medium text-gray-700 dark:text-gray-300">Email: </span>
              <a href="mailto:me@example.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                me@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
