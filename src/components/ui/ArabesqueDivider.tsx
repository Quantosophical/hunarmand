import React from 'react';

export default function ArabesqueDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center w-full my-12 ${className}`}>
      <div className="flex-1 h-[1px] bg-border-gold opacity-50" />
      <div className="mx-4 text-accent/80 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" opacity="0.8" />
          <path d="M12 6L13.2 10.8L18 12L13.2 13.2L12 18L10.8 13.2L6 12L10.8 10.8L12 6Z" fill="var(--background)" />
        </svg>
      </div>
      <div className="flex-1 h-[1px] bg-border-gold opacity-50" />
    </div>
  );
}
