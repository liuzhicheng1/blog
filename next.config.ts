import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  // Windows 下外部工具写入的文件可能不触发系统事件，用轮询监听保证热更新可靠
  watchOptions: {
    pollIntervalMs: 1000,
  },
};

export default nextConfig;
