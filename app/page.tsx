'use client';

export default function Home() {
  // 使用 meta refresh 重定向到 novel.html
  if (typeof window !== 'undefined') {
    window.location.href = '/novel.html';
  }

  return (
    <>
      <meta httpEquiv="refresh" content="0;url=/novel.html" />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'system-ui'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎭</div>
          <h1>AI 小说生成器</h1>
          <p>正在跳转...</p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
            如果没有自动跳转，请<a href="/novel.html" style={{ color: 'white', textDecoration: 'underline' }}>点击这里</a>
          </p>
        </div>
      </div>
    </>
  );
}
