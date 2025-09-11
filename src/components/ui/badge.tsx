import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'bg-amber-400' }) => (
  <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold text-white ${color}`}>
    {children}
  </span>
);
