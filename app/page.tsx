'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // 重定向到小说网站
    window.location.href = '/index.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center">
        <div className="text-6xl mb-4">🎭</div>
        <p className="text-xl text-slate-600">正在跳转到 AI 小说生成器...</p>
      </div>
    </div>
  );
}
