'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type HomeTransitionLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const TRANSITION_DELAY_MS = 280;

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

export default function HomeTransitionLink({
  href,
  children,
  className = '',
  style,
}: HomeTransitionLinkProps) {
  const router = useRouter();
  const timeoutRef = useRef<number | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      document.documentElement.classList.remove('resume-transitioning-to-home');
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
    document.documentElement.classList.add('resume-transitioning-to-home');

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
        className={`${className} home-transition-link ${
          isNavigating ? 'home-transition-link-active' : ''
        }`}
        style={style}
      >
        {children}
      </Link>

      <style jsx global>{`
        .home-transition-link {
          transition:
            opacity 160ms cubic-bezier(0.25, 1, 0.5, 1),
            background-color 160ms cubic-bezier(0.25, 1, 0.5, 1);
        }

        .home-transition-link-active {
          opacity: 0.82;
        }

        .resume-transitioning-to-home .resume-page-shell {
          pointer-events: none;
          animation: resume-page-fade-out 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .resume-transitioning-to-home .resume-paper {
          transform-origin: 50% 0%;
          animation: resume-paper-scale-out 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes resume-page-fade-out {
          from {
            opacity: 1;
          }

          to {
            opacity: 0.52;
          }
        }

        @keyframes resume-paper-scale-out {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          to {
            opacity: 0;
            transform: translateY(24px) scale(0.955);
          }
        }

        @media screen and (max-width: 767px) {
          .resume-transitioning-to-home .resume-page-shell {
            animation-duration: 300ms;
          }

          .resume-transitioning-to-home .resume-paper {
            animation-name: resume-paper-mobile-scale-out;
            animation-duration: 300ms;
          }
        }

        @keyframes resume-paper-mobile-scale-out {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          to {
            opacity: 0.18;
            transform: translateY(12px) scale(0.975);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-transition-link {
            transition-duration: 0.01ms;
          }

          .resume-transitioning-to-home .resume-page-shell,
          .resume-transitioning-to-home .resume-paper {
            animation-duration: 0.01ms;
          }
        }
      `}</style>
    </>
  );
}
