import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { Ingredient } from '@/types';

interface IngredientManagerProps {
  ingredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

const IngredientManager = ({ ingredients, onIngredientsChange }: IngredientManagerProps) => {
  const [newIngredientName, setNewIngredientName] = useState('');

  const addIngredient = () => {
    if (newIngredientName.trim()) {
      const newIngredient: Ingredient = {
        id: `temp-${Date.now()}`,
        productId: '',
        name: newIngredientName.trim()
      };
      onIngredientsChange([...ingredients, newIngredient]);
      setNewIngredientName('');
    }
  };

  const removeIngredient = (id: string) => {
    onIngredientsChange(ingredients.filter(ingredient => ingredient.id !== id));
  };

  const updateIngredientName = (id: string, name: string) => {
    onIngredientsChange(
      ingredients.map(ingredient => 
        ingredient.id === id ? { ...ingredient, name } : ingredient
      )
    );
  };

  return (
    <div className="space-y-4">
      <Label>Ingredientes</Label>
      
      {/* Add new ingredient */}
      <div className="flex gap-2">
        <Input
          placeholder="Nome do ingrediente"
          value={newIngredientName}
          onChange={(e) => setNewIngredientName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
        />
        <Button 
          type="button" 
          onClick={addIngredient}
          size="sm"
          className="whitespace-nowrap"
        >
          <Plus className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
      </div>

      {/* Ingredients list */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {ingredients.map((ingredient) => (
          <Card key={ingredient.id} className="relative">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Input
                  value={ingredient.name}
                  onChange={(e) => updateIngredientName(ingredient.id, e.target.value)}
                  placeholder="Nome do ingrediente"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeIngredient(ingredient.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ingredients.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhum ingrediente adicionado ainda
        </p>
      )}
    </div>
  );
};

export default IngredientManager;