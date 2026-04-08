'use client';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, input, [role="button"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed z-[99999] transition-transform duration-150 ease-out flex items-center justify-center mix-blend-difference hidden md:flex`}
      style={{
        transform: `translate3d(${position.x - 12}px, ${position.y - 12}px, 0) scale(${isHovering ? 2.5 : 1})`,
        width: '24px',
        height: '24px',
      }}
    >
      <div className={`transition-all duration-300 ${isHovering ? 'w-full h-full rounded-full border-[1.5px] border-accent/80' : 'w-[2px] h-[2px] bg-accent'}`}>
        {!isHovering && (
          <>
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-accent/60 -translate-y-1/2 scale-x-[3]" />
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-accent/60 -translate-x-1/2 scale-y-[3]" />
          </>
        )}
      </div>
    </div>
  );
}
