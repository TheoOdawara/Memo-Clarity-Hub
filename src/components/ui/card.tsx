import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = "", style }) => (
  <div className={`bg-white rounded-lg shadow p-4 ${className}`} style={style}>{children}</div>
);

export const CardHeader: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`mb-2 font-bold text-lg ${className}`}>{children}</div>
);

export const CardTitle: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`text-teal-800 text-xl font-semibold ${className}`}>{children}</div>
);

export const CardDescription: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`text-gray-500 text-sm ${className}`}>{children}</div>
);

export const CardContent: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);
