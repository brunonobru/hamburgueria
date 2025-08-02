import React, { useState, useEffect, useRef } from 'react';
import { Product, Order } from '@/types';
import { productsService, ordersService } from '@/services/supabaseService';
import ProductList from '@/components/customer/ProductList';
import Cart from '@/components/customer/Cart';
import CheckoutForm from '@/components/customer/CheckoutForm';
import BottomNavigation from '@/components/customer/BottomNavigation';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Utensils, Beef, Pizza, Wine, IceCream, Flame, Search } from 'lucide-react';
const StoreFront = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<{
    product: Product;
    quantity: number;
    removedIngredients?: string[];
  }[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const cartRef = useRef<any>(null);
  useEffect(() => {
    loadProducts();
  }, []);
  const loadProducts = async () => {
    try {
      const data = await productsService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };
  const handleAddToCart = (product: Product, removedIngredients: string[] = []) => {
    setCartItems([...cartItems, {
      product,
      quantity: 1,
      removedIngredients
    }]);
    const customizationText = removedIngredients.length > 0 ? ` (sem ${removedIngredients.length} ingrediente${removedIngredients.length > 1 ? 's' : ''})` : '';
    toast.success(`${product.name}${customizationText} adicionado ao carrinho`);
  };
  const handleRemoveFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(cartItems.map(item => item.product.id === productId ? {
      ...item,
      quantity
    } : item));
  };
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }
    setIsCheckoutOpen(true);
  };
  const handleSubmitOrder = async (customerName: string, customerPhone: string, deliveryAddress: string, paymentMethod: string) => {
    try {
      const orderData = {
        customerName,
        customerPhone,
        deliveryAddress,
        paymentMethod,
        items: cartItems.map(({
          product,
          quantity,
          removedIngredients
        }) => ({
          id: `item-${Date.now()}-${product.id}`,
          productId: product.id,
          productName: product.name,
          quantity,
          price: product.price,
          removedIngredients: removedIngredients || []
        })),
        total: cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + 5 // Adding delivery fee
      };
      await ordersService.create(orderData);

      // Clear cart and close checkout
      setCartItems([]);
      setIsCheckoutOpen(false);

      // Show success message
      toast.success("Seu pedido foi enviado!");

      // Redirect to order confirmation
      navigate('/order-success');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Erro ao enviar pedido');
    }
  };

  // Group products by category
  const categorizedProducts: Record<string, Product[]> = {};
  products.forEach(product => {
    if (!categorizedProducts[product.category]) {
      categorizedProducts[product.category] = [];
    }
    categorizedProducts[product.category].push(product);
  });

  // Get available categories
  const categories = Object.keys(categorizedProducts);

  // Icon mapping for categories
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'burger':
        return <Beef className="h-5 w-5 mr-2" />;
      case 'pizza':
        return <Pizza className="h-5 w-5 mr-2" />;
      case 'churrasco':
        return <Flame className="h-5 w-5 mr-2" />;
      case 'steak':
        return <Utensils className="h-5 w-5 mr-2" />;
      case 'drink':
        return <Wine className="h-5 w-5 mr-2" />;
      case 'dessert':
        return <IceCream className="h-5 w-5 mr-2" />;
      default:
        return null;
    }
  };

  // Category name translation
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'burger':
        return 'Burgers';
      case 'pizza':
        return 'Pizzas';
      case 'churrasco':
        return 'Churrasco';
      case 'steak':
        return 'Steaks';
      case 'drink':
        return 'Bebidas';
      case 'dessert':
        return 'Sobremesas';
      default:
        return category;
    }
  };
  return <div className="min-h-screen bg-gray-50">
      <header className="bg-white py-4 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Utensils className="h-6 w-6 text-[#FF7A30]" />
            <h1 className="text-xl font-bold">BurguerX</h1>
          </div>
          <div className="flex items-center gap-3">
            
            <Cart ref={cartRef} cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} onUpdateQuantity={handleUpdateQuantity} onCheckout={handleCheckout} />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-4">
        <Tabs defaultValue={categories[0]}>
          <div className="sticky top-[73px] bg-white z-10 pb-2 mb-4 border-b">
            <TabsList className="w-full justify-start overflow-x-auto py-2">
              {categories.map(category => <TabsTrigger key={category} value={category} className="flex items-center px-5">
                  {getCategoryIcon(category)}
                  {getCategoryName(category)}
                  <Badge variant="secondary" className="ml-2">
                    {categorizedProducts[category].length}
                  </Badge>
                </TabsTrigger>)}
            </TabsList>
          </div>
          
          {categories.map(category => <TabsContent key={category} value={category} className="py-2">
              <ProductList products={categorizedProducts[category]} cartItems={cartItems} onAddToCart={handleAddToCart} onRemoveFromCart={handleRemoveFromCart} onUpdateQuantity={handleUpdateQuantity} />
            </TabsContent>)}
        </Tabs>
      </main>
      
      <CheckoutForm cartItems={cartItems} isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} onSubmitOrder={handleSubmitOrder} />
      
      <div className="pb-16">
        
      </div>

      <BottomNavigation cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} onCartClick={() => cartRef.current?.openCart()} />
    </div>;
};
export default StoreFront;