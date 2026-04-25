import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@fontsource/noto-sans-sc/chinese-simplified-400.css';
import '@fontsource/noto-sans-sc/chinese-simplified-500.css';
import '@fontsource/noto-sans-sc/chinese-simplified-700.css';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{localStorage.removeItem('theme');var r=document.documentElement;var m=window.matchMedia('(prefers-color-scheme: dark)');var a=function(d){r.classList.toggle('dark',d)};a(m.matches);m.addEventListener('change',function(e){a(e.matches)})}catch(e){}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
