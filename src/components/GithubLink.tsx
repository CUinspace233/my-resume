'use client';

import { FC } from 'react';

interface GithubLinkProps {
  repoUrl: string;
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'responsive';
}

const GithubLink: FC<GithubLinkProps> = ({ repoUrl, className = '', size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-9 w-9',
    medium: 'h-10 w-10',
    large: 'h-12 w-12',
    responsive: 'h-10 w-10 sm:h-10 sm:w-10 md:h-10 md:w-10',
  };

  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex shrink-0 items-center justify-center rounded-xl transition-opacity hover:opacity-90 print:hidden ${sizeClasses[size]} ${className}`}
      aria-label="View source code on GitHub"
    >
      <span className="github-shader-logo h-full w-full" aria-hidden="true" />
    </a>
  );
};

export default GithubLink;
