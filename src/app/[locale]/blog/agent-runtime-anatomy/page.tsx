import type { Metadata } from 'next';
import AgentRuntimeArticle from '@/components/blog/AgentRuntimeArticle';
import { createBlogJsonLd, createBlogMetadata, JsonLdScript, type BlogSeoConfig } from '@/lib/seo';

type PageProps = {
  params: Promise<{ locale: string }>;
};

const blogSeo: BlogSeoConfig = {
  slug: 'blog/agent-runtime-anatomy',
  publishedTime: '2026-05-22T00:00:00.000Z',
  category: 'Technology',
  keywords: [
    'Claude Code',
    'AI Agent',
    'Agent Runtime',
    'Tool Calling',
    'Context Management',
    'Looped Reasoning',
    '源码阅读',
    '工具调用',
    '上下文管理',
  ],
  tags: ['Claude Code', 'AI Agent', 'Tool Calling', 'Context Management'],
  copy: {
    en: {
      title: 'Agents are not chatbots. They are runtimes that keep reconnecting the loop.',
      description:
        'A Claude Code source-reading note on how agent runtimes turn model output into tool execution, context updates, and continued reasoning.',
    },
    zh: {
      title: 'Agent 不是聊天机器人，而是一台会反复接线的运行时机器',
      description:
        '一篇 Claude Code 源码阅读笔记，拆解 Agent 运行时如何把模型输出变成工具执行、上下文更新和持续推理。',
    },
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createBlogMetadata(blogSeo, locale);
}

export default async function AgentRuntimeBlogPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <JsonLdScript data={createBlogJsonLd(blogSeo, locale)} />
      <AgentRuntimeArticle locale={locale} />
    </>
  );
}
