import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import brainLogo from '@/assets/brain-logo.png';

const Header: React.FC = () => {
  return (
    <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between shadow-card">
      <div className="flex items-center gap-3">
        <img 
          src={brainLogo} 
          alt="Memo Clarity" 
          className="w-8 h-8"
        />
        <h1 className="text-xl font-bold text-primary">Memo Clarity</h1>
      </div>
      
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 bg-secondary w-2 h-2 rounded-full"></span>
      </Button>
    </header>
  );
};

export default Header;