import type { Metadata } from 'next';
import MultiAgentArticle from '@/components/blog/MultiAgentArticle';
import { createBlogJsonLd, createBlogMetadata, JsonLdScript, type BlogSeoConfig } from '@/lib/seo';

type PageProps = {
  params: Promise<{ locale: string }>;
};

const blogSeo: BlogSeoConfig = {
  slug: 'blog/multi-agent-collaboration',
  publishedTime: '2026-05-22T00:00:00.000Z',
  category: 'Technology',
  keywords: [
    'Claude Code',
    'Multi Agent',
    'Agent Swarm',
    'AI Agent',
    'Coordinator',
    'SendMessage',
    'Task Management',
    '源码阅读',
    '多智能体',
    '协作机制',
  ],
  tags: ['Claude Code', 'Multi Agent', 'Agent Swarm', 'Coordinator'],
  copy: {
    en: {
      title: 'Claude Code multi-agent turns collaboration into protocol.',
      description:
        'A detailed source-reading note on Claude Code multi-agent coordination: teams, task lists, mailboxes, agent lifecycles, permissions, and recoverable handoff.',
    },
    zh: {
      title: 'Claude Code 里的 Multi Agent：把协作做成协议',
      description:
        '一篇更深入的 Claude Code 源码阅读笔记，拆解 Multi Agent 如何通过 team、task list、mailbox、生命周期、权限和恢复机制协作。',
    },
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createBlogMetadata(blogSeo, locale);
}

export default async function MultiAgentBlogPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <JsonLdScript data={createBlogJsonLd(blogSeo, locale)} />
      <MultiAgentArticle locale={locale} />
    </>
  );
}
