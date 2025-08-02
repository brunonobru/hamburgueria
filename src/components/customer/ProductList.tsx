
import React, { useState } from 'react';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCustomization from './ProductCustomization';

interface ProductListProps {
  products: Product[];
  cartItems: { product: Product; quantity: number; removedIngredients?: string[] }[];
  onAddToCart: (product: Product, removedIngredients?: string[]) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const ProductList = ({ 
  products, 
  cartItems, 
  onAddToCart, 
  onRemoveFromCart, 
  onUpdateQuantity 
}: ProductListProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  
  const getCartQuantity = (productId: string) => {
    const item = cartItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const handleAddClick = (product: Product) => {
    setSelectedProduct(product);
    setIsCustomizationOpen(true);
  };

  const handleCustomizationAddToCart = (product: Product, removedIngredients: string[]) => {
    onAddToCart(product, removedIngredients);
  };
  
  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.filter(p => p.available).map((product) => {
          const quantity = getCartQuantity(product.id);
          
          return (
            <Card key={product.id} className="overflow-hidden border border-gray-200 rounded-lg">
              <div className="h-40 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium text-base mb-1">{product.name}</h3>
                <p className="text-food-primary font-bold mb-2">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                
                {quantity === 0 ? (
                  <Button 
                    className="w-full bg-[#FF7A30] hover:bg-[#E66A20] text-white"
                    onClick={() => handleAddClick(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Adicionar
                  </Button>
                ) : (
                  <div className="flex items-center justify-between bg-muted rounded-md p-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={() => {
                        if (quantity === 1) {
                          onRemoveFromCart(product.id);
                        } else {
                          onUpdateQuantity(product.id, quantity - 1);
                        }
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium">{quantity}</span>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <ProductCustomization
        product={selectedProduct}
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
        onAddToCart={handleCustomizationAddToCart}
      />
    </>
  );
};

export default ProductList;
