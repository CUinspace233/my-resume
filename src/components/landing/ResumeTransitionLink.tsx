'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type ResumeTransitionLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const TRANSITION_DELAY_MS = 180;

function shouldOpenNormally(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.currentTarget.target === '_blank'
  );
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function ResumeTransitionLink({
  href,
  children,
  className = '',
  style,
}: ResumeTransitionLinkProps) {
  const router = useRouter();
  const timeoutRef = useRef<number | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      document.documentElement.classList.remove('resume-transitioning-to-resume');
    };
  }, []);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (shouldOpenNormally(event)) return;

    event.preventDefault();

    if (prefersReducedMotion()) {
      router.push(href);
      return;
    }

    setIsNavigating(true);
    document.documentElement.classList.add('resume-transitioning-to-resume');

    timeoutRef.current = window.setTimeout(() => {
      router.push(href);
    }, TRANSITION_DELAY_MS);
  };

  return (
    <>
      <Link
        href={href}
        onClick={handleClick}
        aria-busy={isNavigating}
        className={`${className} resume-transition-link ${isNavigating ? 'resume-transition-link-active' : ''}`}
        style={style}
      >
        <span className="resume-transition-link-content">{children}</span>
      </Link>

      <style jsx global>{`
        .resume-transition-link {
          position: relative;
          transition:
            opacity 160ms cubic-bezier(0.25, 1, 0.5, 1),
            box-shadow 220ms cubic-bezier(0.25, 1, 0.5, 1);
        }

        .resume-transition-link-content {
          position: relative;
          z-index: 1;
        }

        .resume-transition-link-active {
          opacity: 0.84;
        }

        .landing-page-shell {
          animation: landing-fade-in 260ms cubic-bezier(0.25, 1, 0.5, 1) both;
        }

        .resume-transitioning-to-resume .landing-page-shell {
          pointer-events: none;
          animation: landing-fade-out 180ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes landing-fade-in {
          from {
            opacity: 0.72;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes landing-fade-out {
          from {
            opacity: 1;
          }

          to {
            opacity: 0.74;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .resume-transition-link {
            transition-duration: 0.01ms;
          }

          .resume-transitioning-to-resume .landing-page-shell {
            animation-duration: 0.01ms;
          }

          .landing-page-shell {
            animation-duration: 0.01ms;
          }
        }
      `}</style>
    </>
  );
}
