'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export default function Card({ children, className = '', hover = false, padding = 'md' }: CardProps) {
  const baseStyles = 'bg-white rounded-xl shadow-md transition-all duration-300';
  const hoverStyles = hover ? 'hover:shadow-2xl hover:-translate-y-1' : '';
  
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`${baseStyles} ${hoverStyles} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}

