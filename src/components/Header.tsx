import React from 'react';
import { Bell, Brain, Search, Menu, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppContext } from '@/context/AppContext';
import brainLogo from '@/assets/brain-logo.png';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { userData } = useAppContext();

  return (
    <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Left: Logo + Trigger + Search */}
        <div className="flex items-center gap-4 flex-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <img 
              src={brainLogo} 
              alt="Memo Clarity" 
              className="w-8 h-8"
            />
            <h1 className="text-xl font-bold text-primary hidden sm:block">Memo Clarity</h1>
          </div>
          
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar no Memo Clarity"
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>
        </div>

        {/* Center: Navigation Icons */}
        <div className="hidden lg:flex items-center gap-2">
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-12 px-4">
            <Bell className="w-5 h-5" />
            <span className="text-xs">Início</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-12 px-4">
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">Chat</span>
          </Button>
        </div>

        {/* Right: User Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative hidden sm:flex">
            <Menu className="w-5 h-5" />
          </Button>
          
          <Button variant="ghost" size="sm" className="relative">
            <MessageCircle className="w-5 h-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
            >
              2
            </Badge>
          </Button>
          
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
            >
              3
            </Badge>
          </Button>

          <Avatar className="w-8 h-8 cursor-pointer">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;