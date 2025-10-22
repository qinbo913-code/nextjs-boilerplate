export default function Home() {
  // 直接返回 iframe 嵌入静态 HTML
  return (
    <iframe
      src="/index.html"
      style={{
        width: '100%',
        height: '100vh',
        border: 'none',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        display: 'block'
      }}
      title="AI小说生成器"
    />
  );
}
