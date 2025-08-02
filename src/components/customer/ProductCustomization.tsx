import React, { useState } from 'react';
import { Product, Ingredient } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ShoppingCart } from 'lucide-react';

interface ProductCustomizationProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, removedIngredients: string[]) => void;
}

const ProductCustomization = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart 
}: ProductCustomizationProps) => {
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);

  const handleRemoveIngredient = (ingredientName: string) => {
    setRemovedIngredients(prev => [...prev, ingredientName]);
  };

  const handleAddIngredient = (ingredientName: string) => {
    setRemovedIngredients(prev => prev.filter(name => name !== ingredientName));
  };

  const handleAddToCart = () => {
    if (product) {
      onAddToCart(product, removedIngredients);
      setRemovedIngredients([]);
      onClose();
    }
  };

  const handleClose = () => {
    setRemovedIngredients([]);
    onClose();
  };

  if (!product) return null;

  // Default ingredients if none exist in the product
  const defaultIngredients: Ingredient[] = product.ingredients?.length ? product.ingredients : [
    { id: '1', productId: product.id, name: 'Pão' },
    { id: '2', productId: product.id, name: 'Carne' },
    { id: '3', productId: product.id, name: 'Queijo' },
    { id: '4', productId: product.id, name: 'Alface' },
    { id: '5', productId: product.id, name: 'Tomate' },
    { id: '6', productId: product.id, name: 'Cebola' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="h-32 overflow-hidden rounded-lg">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Ingredientes inclusos:</h3>
            <div className="space-y-2">
              {defaultIngredients.map((ingredient) => {
                const isRemoved = removedIngredients.includes(ingredient.name);
                
                return (
                  <div 
                    key={ingredient.id}
                    className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
                      isRemoved 
                        ? 'bg-red-50 border-red-200 opacity-60' 
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <span className={`font-medium ${isRemoved ? 'line-through text-red-600' : 'text-green-700'}`}>
                      {ingredient.name}
                    </span>
                    
                    {isRemoved ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs border-green-300 text-green-700 hover:bg-green-100"
                        onClick={() => handleAddIngredient(ingredient.name)}
                      >
                        Incluir
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs border-red-300 text-red-700 hover:bg-red-100"
                        onClick={() => handleRemoveIngredient(ingredient.name)}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Remover
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {removedIngredients.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-medium text-amber-800 mb-2">Ingredientes removidos:</p>
              <div className="flex flex-wrap gap-1">
                {removedIngredients.map(ingredientName => (
                  <Badge key={ingredientName} variant="secondary" className="text-xs">
                    {ingredientName}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button 
              className="flex-1 bg-[#FF7A30] hover:bg-[#E66A20] text-white"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCustomization;