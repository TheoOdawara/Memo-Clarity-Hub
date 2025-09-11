import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button
    className="px-4 py-2 rounded bg-teal-800 text-white font-semibold hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-400 text-lg"
    {...props}
  >
    {children}
  </button>
);
