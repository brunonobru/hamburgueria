-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('burger', 'pizza', 'churrasco', 'steak', 'drink', 'dessert', 'snack', 'combo')),
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products (public read, admin write)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Products can be managed by authenticated users" 
ON public.products 
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  delivery_address TEXT,
  payment_method TEXT,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Orders are viewable by authenticated users" 
ON public.orders 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Orders can be managed by authenticated users" 
ON public.orders 
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for order items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for order items
CREATE POLICY "Order items are viewable by authenticated users" 
ON public.order_items 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Order items can be managed by authenticated users" 
ON public.order_items 
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial products data with proper UUIDs
INSERT INTO public.products (id, name, description, price, image, category, available) VALUES
(gen_random_uuid(), 'X-Frango', 'Delicioso hambúrguer de frango com alface e molho especial', 15.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'burger', true),
(gen_random_uuid(), 'X-Tudo', 'Hambúrguer completo com queijo, bacon, ovo e salada', 20.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'burger', true),
(gen_random_uuid(), 'X-FILE', 'Triplo hambúrguer com muito queijo cheddar', 10.00, 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'burger', true),
(gen_random_uuid(), 'X-Burger', 'Clássico hambúrguer com queijo, alface e tomate', 18.90, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'burger', true),
(gen_random_uuid(), 'French Fries', 'Batatas fritas crocantes com sal marinho', 3.99, 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'snack', true),
(gen_random_uuid(), 'Combo Família', 'Hambúrguer, batatas fritas e bebida para 4 pessoas', 39.99, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'combo', true);