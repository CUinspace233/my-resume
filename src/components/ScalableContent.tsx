'use client';

import { useEffect, useRef, useState } from 'react';

interface ScalableContentProps {
  children: React.ReactNode;
  baseWidth?: number; // 基准宽度，单位为像素
}

export default function ScalableContent({ children, baseWidth = 793 }: ScalableContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.parentElement?.clientWidth || window.innerWidth;
        const newScale = Math.min(1, parentWidth / baseWidth);
        setScale(newScale);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [baseWidth]);

  return (
    <div ref={containerRef} className="flex justify-center">
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: baseWidth,
        }}
      >
        {children}
      </div>
    </div>
  );
}
