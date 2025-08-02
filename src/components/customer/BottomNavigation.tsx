import React from 'react';
import { Home, Search, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BottomNavigationProps {
  cartItemsCount?: number;
  onCartClick: () => void;
}

const BottomNavigation = ({ cartItemsCount = 0, onCartClick }: BottomNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        <Link to="/" className="flex flex-col items-center gap-1">
          <Button variant="ghost" size="sm" className="flex flex-col h-auto py-2 px-3">
            <Home className="h-5 w-5" />
            <span className="text-xs">Início</span>
          </Button>
        </Link>
        
        <Link to="/track-order" className="flex flex-col items-center gap-1">
          <Button variant="ghost" size="sm" className="flex flex-col h-auto py-2 px-3">
            <Search className="h-5 w-5" />
            <span className="text-xs">Pedido</span>
          </Button>
        </Link>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex flex-col h-auto py-2 px-3 relative"
          onClick={onCartClick}
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="text-xs">Carrinho</span>
          {cartItemsCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#FF7A30] text-white text-xs">
              {cartItemsCount}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BottomNavigation;