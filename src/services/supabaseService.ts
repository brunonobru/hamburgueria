import { supabase } from '@/integrations/supabase/client';
import { Product, Order, OrderItem, OrderStatus, Ingredient } from '@/types';

// Products Service
export const productsService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Get ingredients for all products
    const products = data as Product[] || [];
    const productsWithIngredients = await Promise.all(
      products.map(async (product) => {
        const ingredients = await ingredientsService.getByProductId(product.id);
        return { ...product, ingredients };
      })
    );
    
    return productsWithIngredients;
  },

  async getAllForAdmin(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Get ingredients for all products
    const products = data as Product[] || [];
    const productsWithIngredients = await Promise.all(
      products.map(async (product) => {
        const ingredients = await ingredientsService.getByProductId(product.id);
        return { ...product, ingredients };
      })
    );
    
    return productsWithIngredients;
  },

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    if (!data) return null;
    
    // Get ingredients for this product
    const ingredients = await ingredientsService.getByProductId(id);
    return { ...data, ingredients } as Product;
  },

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    try {
      console.log('Criando produto no Supabase:', product);
      const { ingredients, ...productData } = product;
      
      // Remove any id field to let the database generate the UUID
      const { id, ...cleanProductData } = productData as any;
      
      console.log('Dados do produto (sem ingredientes e id):', cleanProductData);
      
      const { data, error } = await supabase
        .from('products')
        .insert([cleanProductData])
        .select()
        .single();
      
      if (error) {
        console.error('Erro do Supabase ao inserir produto:', error);
        throw error;
      }
      
      console.log('Produto criado com sucesso:', data);
      
      // Save ingredients if any
      if (ingredients && ingredients.length > 0) {
        await ingredientsService.createMany(data.id, ingredients);
      }
      
      // Get the complete product with ingredients
      const savedIngredients = await ingredientsService.getByProductId(data.id);
      return { ...data, ingredients: savedIngredients } as Product;
    } catch (error) {
      console.error('Erro na função create do productsService:', error);
      throw error;
    }
  },

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const { ingredients, ...productData } = product;
    
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Update ingredients if provided
    if (ingredients !== undefined) {
      // Delete existing ingredients
      await ingredientsService.deleteByProductId(id);
      
      // Create new ingredients
      if (ingredients.length > 0) {
        await ingredientsService.createMany(id, ingredients);
      }
    }
    
    // Get the complete product with ingredients
    const savedIngredients = await ingredientsService.getByProductId(id);
    return { ...data, ingredients: savedIngredients } as Product;
  },

  async delete(id: string): Promise<void> {
    // Delete ingredients first
    await ingredientsService.deleteByProductId(id);
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Ingredients Service
export const ingredientsService = {
  async getByProductId(productId: string): Promise<Ingredient[]> {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('product_id', productId);
    
    if (error) throw error;
    
    return (data || []).map(item => ({
      id: item.id,
      productId: item.product_id,
      name: item.name
    }));
  },

  async createMany(productId: string, ingredients: Ingredient[]): Promise<void> {
    if (ingredients.length === 0) return;
    
    const ingredientData = ingredients.map(ingredient => ({
      product_id: productId,
      name: ingredient.name
    }));
    
    const { error } = await supabase
      .from('ingredients')
      .insert(ingredientData);
    
    if (error) throw error;
  },

  async deleteByProductId(productId: string): Promise<void> {
    const { error } = await supabase
      .from('ingredients')
      .delete()
      .eq('product_id', productId);
    
    if (error) throw error;
  }
};

// Orders Service
export const ordersService = {
  async getAll(): Promise<Order[]> {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return orders?.map(order => ({
      id: order.id,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      deliveryAddress: order.delivery_address,
      paymentMethod: order.payment_method,
      total: order.total,
      status: order.status as OrderStatus,
      items: order.order_items?.map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        price: item.price,
        removedIngredients: item.removed_ingredients || []
      })) || [],
      createdAt: new Date(order.created_at),
      updatedAt: new Date(order.updated_at)
    })) || [];
  },

  async getById(id: string): Promise<Order | null> {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!order) return null;
    
    return {
      id: order.id,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      deliveryAddress: order.delivery_address,
      paymentMethod: order.payment_method,
      total: order.total,
      status: order.status as OrderStatus,
      items: order.order_items?.map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        price: item.price,
        removedIngredients: item.removed_ingredients || []
      })) || [],
      createdAt: new Date(order.created_at),
      updatedAt: new Date(order.updated_at)
    };
  },

  async create(orderData: {
    customerName: string;
    customerPhone?: string;
    deliveryAddress?: string;
    paymentMethod?: string;
    items: OrderItem[];
    total: number;
  }): Promise<Order> {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        delivery_address: orderData.deliveryAddress,
        payment_method: orderData.paymentMethod,
        total: orderData.total,
        status: 'pending'
      }])
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Insert order items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        price: item.price,
        removed_ingredients: item.removedIngredients || []
      })));
    
    if (itemsError) throw itemsError;
    
    // Return the complete order with items
    return this.getById(order.id) as Promise<Order>;
  },

  async updateStatus(id: string, status: Order['status']): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return this.getById(id) as Promise<Order>;
  }
};