
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ChefHat } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  return (
    <Card className="food-card overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-3 py-1">Indisponível</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <Badge variant="outline" className="mt-1 mb-2 capitalize">{product.category}</Badge>
          </div>
          <div className="text-xl font-bold text-food-primary">R$ {product.price.toFixed(2)}</div>
        </div>
        <p className="text-muted-foreground text-sm mb-3">{product.description}</p>

        {product.ingredients && product.ingredients.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <ChefHat className="h-3 w-3" />
              <span>Ingredientes:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.ingredients.map((ingredient) => (
                <Badge key={ingredient.id} variant="outline" className="text-xs">
                  {ingredient.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 flex items-center gap-1"
            onClick={() => onEdit(product)}
          >
            <Edit className="h-4 w-4" />
            <span>Editar</span>
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            className="flex-1 flex items-center gap-1"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span>Excluir</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
