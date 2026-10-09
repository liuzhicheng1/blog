'use client';

import { ConfigProvider, theme as antdTheme } from 'antd';
import AntdApp from 'antd/es/app';
import { useTheme } from './ThemeProvider';

// 让 antd 组件主题跟随深浅色切换（默认 antd 不知道页面处于深色模式）
export default function AntdConfigProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
        },
      }}
    >
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}
