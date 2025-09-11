import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
  const baseClasses = "rounded font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors";
  
  const variantClasses = {
    default: "bg-teal-800 text-white hover:bg-teal-900",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100"
  };
  
  const sizeClasses = {
    default: "px-4 py-2 text-lg",
    sm: "px-3 py-1.5 text-sm",
    lg: "px-6 py-3 text-xl"
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
