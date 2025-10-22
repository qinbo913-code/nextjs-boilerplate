'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // 使用客户端重定向到静态 HTML
    // 由于 public/index.html 可以通过 /index.html 访问
    window.location.replace('/index.html');
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎭</div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>AI 小说生成器</h1>
        <p style={{ opacity: 0.9 }}>正在加载...</p>
      </div>
    </div>
  );
}
