import type { Metadata } from 'next';
import { createElement } from 'react';

export const siteUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.cuinspace.com';
export const siteName = 'Henrick Lin';
export const siteAuthor = 'Henrick Lin';
export const defaultSeoImage = '/smallsizeavatar.png';

export type SeoLocale = 'en' | 'zh';

type LocalizedSeoCopy = Record<
  SeoLocale,
  {
    title: string;
    description: string;
  }
>;

export type BlogSeoConfig = {
  slug: string;
  copy: LocalizedSeoCopy;
  publishedTime: string;
  modifiedTime?: string;
  category?: string;
  keywords?: string[];
  tags?: string[];
  image?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
};

export function normalizeSeoLocale(locale: string): SeoLocale {
  return locale === 'en' ? 'en' : 'zh';
}

export function getLocalizedBlogSeo(config: BlogSeoConfig, locale: string) {
  const normalizedLocale = normalizeSeoLocale(locale);
  const copy = config.copy[normalizedLocale];
  const url = `${siteUrl}/${normalizedLocale}/${config.slug}`;
  const image = config.image ?? {
    url: `${siteUrl}${defaultSeoImage}`,
    width: 192,
    height: 192,
    alt: siteAuthor,
  };
  const modifiedTime = config.modifiedTime ?? config.publishedTime;

  return {
    copy,
    image,
    modifiedTime,
    normalizedLocale,
    url,
  };
}

export function createBlogMetadata(config: BlogSeoConfig, locale: string): Metadata {
  const { copy, image, modifiedTime, normalizedLocale, url } = getLocalizedBlogSeo(config, locale);

  return {
    title: copy.title,
    description: copy.description,
    authors: [{ name: siteAuthor, url: `${siteUrl}/${normalizedLocale}` }],
    category: config.category ?? 'Technology',
    keywords: config.keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${siteUrl}/en/${config.slug}`,
        zh: `${siteUrl}/zh/${config.slug}`,
      },
    },
    openGraph: {
      type: 'article',
      url,
      siteName,
      title: copy.title,
      description: copy.description,
      locale: normalizedLocale === 'zh' ? 'zh_CN' : 'en_US',
      publishedTime: config.publishedTime,
      modifiedTime,
      authors: [siteAuthor],
      tags: config.tags,
      images: [image],
    },
    twitter: {
      card: 'summary',
      title: copy.title,
      description: copy.description,
      images: [image.url],
    },
  };
}

export function createBlogJsonLd(config: BlogSeoConfig, locale: string) {
  const { copy, image, modifiedTime, normalizedLocale, url } = getLocalizedBlogSeo(config, locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: copy.title,
    description: copy.description,
    image: image.url,
    datePublished: config.publishedTime,
    dateModified: modifiedTime,
    inLanguage: normalizedLocale === 'zh' ? 'zh-CN' : 'en-US',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    author: {
      '@type': 'Person',
      name: siteAuthor,
      url: `${siteUrl}/${normalizedLocale}`,
    },
    publisher: {
      '@type': 'Person',
      name: siteAuthor,
    },
    keywords: config.keywords,
  };
}

export function JsonLdScript({ data }: { data: unknown }) {
  return createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  });
}
