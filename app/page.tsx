import { redirect } from 'next/navigation';

export default function Home() {
  // 服务端重定向到静态 HTML
  redirect('/index.html');
}
