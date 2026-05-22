# Blog SEO helper

Use `src/lib/seo.ts` for future blog pages.

```tsx
import type { Metadata } from 'next';
import { createBlogJsonLd, createBlogMetadata, JsonLdScript, type BlogSeoConfig } from '@/lib/seo';

const blogSeo: BlogSeoConfig = {
  slug: 'blog/my-article-slug',
  publishedTime: '2026-05-22T00:00:00.000Z',
  category: 'Technology',
  keywords: ['AI Agent', 'Next.js'],
  tags: ['AI Agent', 'Next.js'],
  copy: {
    en: {
      title: 'English article title',
      description: 'English SEO description.',
    },
    zh: {
      title: '中文文章标题',
      description: '中文 SEO 描述。',
    },
  },
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createBlogMetadata(blogSeo, locale);
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <JsonLdScript data={createBlogJsonLd(blogSeo, locale)} />
      {/* Article component here */}
    </>
  );
}
```

Also add the article URL to `src/app/sitemap.ts`.
