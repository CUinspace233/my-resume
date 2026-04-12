'use client';

import { useEffect, useRef, useState } from 'react';

interface ScalableContentProps {
  children: React.ReactNode;
  baseWidth?: number; // 基准宽度，单位为像素
  mobileBreakpoint?: number;
}

export default function ScalableContent({
  children,
  baseWidth = 793,
  mobileBreakpoint = 768,
}: ScalableContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [useMobileLayout, setUseMobileLayout] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.parentElement?.clientWidth || window.innerWidth;
        const shouldUseMobileLayout = window.innerWidth < mobileBreakpoint;

        setUseMobileLayout(shouldUseMobileLayout);
        setScale(shouldUseMobileLayout ? 1 : Math.min(1, parentWidth / baseWidth));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [baseWidth, mobileBreakpoint]);

  return (
    <div ref={containerRef} className="flex justify-center w-full">
      <div
        style={{
          transform: useMobileLayout ? 'none' : `scale(${scale})`,
          transformOrigin: 'top center',
          width: useMobileLayout ? '100%' : baseWidth,
          maxWidth: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
}
