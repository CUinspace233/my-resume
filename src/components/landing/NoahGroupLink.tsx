import type { ReactNode } from 'react';

export const NOAH_GROUP_URL = 'https://www.noahgroup.com';
export const NOAH_LINK_COLOR = '#ff5b4f';

type NoahGroupLinkProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export default function NoahGroupLink({ children, className, style }: NoahGroupLinkProps) {
  return (
    <a
      href={NOAH_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={{
        color: NOAH_LINK_COLOR,
        textDecoration: 'none',
        paddingInline: '0.15em',
        ...style,
      }}
    >
      {children}
    </a>
  );
}
