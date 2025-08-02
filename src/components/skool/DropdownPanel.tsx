'use client';

import { useEffect, useRef } from 'react';

interface DropdownPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'right';
  type?: string;
}

export default function DropdownPanel({
  isOpen,
  onClose,
  children,
  className = '',
  align = 'right',
  type
}: DropdownPanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={`absolute top-10 ${align === 'right' ? 'right-0' : 'left-0'} z-50 
        ${type === 'profile'
          ? 'w-[200px] h-fit py-2'
          : 'w-[90vw] sm:w-[400px] max-h-[80vh]'} 
        overflow-y-auto rounded-md border border-gray-200 shadow-lg bg-white ${className}`}
    >
      {children}
    </div>
  );
}
