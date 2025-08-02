import React, { useState, useEffect } from 'react';
import { Search, Package, Clock, CheckCircle, Truck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderStatus } from '@/types';
import BottomNavigation from '@/components/customer/BottomNavigation';

const OrderTracking = () => {
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'preparing':
        return <Package className="h-5 w-5" />;
      case 'ready':
        return <CheckCircle className="h-5 w-5" />;
      case 'delivered':
        return <Truck className="h-5 w-5" />;
      case 'cancelled':
        return <X className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'preparing':
        return 'Preparando';
      case 'ready':
        return 'Pronto';
      case 'delivered':
        return 'Entregue';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'preparing':
        return 'bg-blue-500';
      case 'ready':
        return 'bg-green-500';
      case 'delivered':
        return 'bg-emerald-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const searchOrder = async () => {
    if (!phone.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite seu número de telefone",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items!inner(
            id,
            product_name,
            quantity,
            price,
            removed_ingredients
          )
        `)
        .eq('customer_phone', phone)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const orderData = data[0];
        setOrder({
          id: orderData.id,
          status: orderData.status as OrderStatus,
          total: orderData.total,
          customerName: orderData.customer_name,
          customerPhone: orderData.customer_phone,
          deliveryAddress: orderData.delivery_address,
          paymentMethod: orderData.payment_method,
          items: orderData.order_items.map((item: any) => ({
            id: item.id,
            productId: item.product_id || '',
            productName: item.product_name,
            quantity: item.quantity,
            price: item.price,
            removedIngredients: item.removed_ingredients
          })),
          createdAt: new Date(orderData.created_at),
          updatedAt: new Date(orderData.updated_at)
        });
      } else {
        setOrder(null);
        toast({
          title: "Pedido não encontrado",
          description: "Não foi encontrado nenhum pedido com este número de telefone",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error searching order:', error);
      toast({
        title: "Erro",
        description: "Erro ao buscar pedido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Real-time updates for order status
  useEffect(() => {
    if (!order) return;

    const channel = supabase
      .channel('order-tracking')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${order.id}`
        },
        (payload) => {
          const updatedOrder = payload.new as any;
          setOrder(prev => prev ? {
            ...prev,
            status: updatedOrder.status as OrderStatus,
            updatedAt: new Date(updatedOrder.updated_at)
          } : null);
          
          toast({
            title: "Status Atualizado! 📋",
            description: `Seu pedido agora está: ${getStatusLabel(updatedOrder.status)}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order, toast]);

  const getStatusSteps = () => {
    const steps = [
      { status: 'pending', label: 'Pendente' },
      { status: 'preparing', label: 'Preparando' },
      { status: 'ready', label: 'Pronto' },
      { status: 'delivered', label: 'Entregue' }
    ];

    const currentIndex = steps.findIndex(step => step.status === order?.status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  return (
    <>
      <div className="min-h-screen bg-muted/20 p-4 pb-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Acompanhar Pedido</h1>
            <p className="text-muted-foreground">
              Digite seu telefone para acompanhar o status do seu pedido
            </p>
          </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="tel"
                placeholder="Digite seu número de telefone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchOrder()}
              />
              <Button onClick={searchOrder} disabled={loading}>
                {loading ? 'Buscando...' : 'Acompanhar Pedido'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {order && (
          <div className="space-y-6">
            {/* Order Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    Pedido #{order.id.slice(0, 8)}
                  </CardTitle>
                  <Badge className={`${getStatusColor(order.status)} text-white`}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Cliente:</strong> {order.customerName}</p>
                    <p><strong>Telefone:</strong> {order.customerPhone}</p>
                    {order.deliveryAddress && (
                      <p><strong>Endereço:</strong> {order.deliveryAddress}</p>
                    )}
                  </div>
                  <div>
                    <p><strong>Total:</strong> R$ {order.total.toFixed(2)}</p>
                    <p><strong>Pedido em:</strong> {order.createdAt.toLocaleString('pt-BR')}</p>
                    <p><strong>Atualizado em:</strong> {order.updatedAt.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Progress */}
            {order.status !== 'cancelled' && (
              <Card>
                <CardHeader>
                  <CardTitle>Progresso do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {getStatusSteps().map((step, index) => (
                      <div key={step.status} className="flex flex-col items-center flex-1">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium
                          ${step.completed ? getStatusColor(step.status as OrderStatus) : 'bg-gray-300'}
                        `}>
                          {step.completed ? '✓' : index + 1}
                        </div>
                        <span className={`text-xs mt-1 text-center ${step.current ? 'font-medium' : 'text-muted-foreground'}`}>
                          {step.label}
                        </span>
                        {index < getStatusSteps().length - 1 && (
                          <div className={`h-1 w-full mt-2 ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantidade: {item.quantity}
                        </p>
                        {item.removedIngredients && item.removedIngredients.length > 0 && (
                          <p className="text-sm text-red-600">
                            Sem: {item.removedIngredients.join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        </div>
      </div>

      <BottomNavigation 
        cartItemsCount={0}
        onCartClick={() => {}}
      />
    </>
  );
};

export default OrderTracking;