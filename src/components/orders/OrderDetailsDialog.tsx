
import React from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Order, OrderStatus } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { MapPin, CreditCard, Banknote } from 'lucide-react';

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  preparing: "bg-blue-100 text-blue-800 border-blue-200",
  ready: "bg-green-100 text-green-800 border-green-200",
  delivered: "bg-purple-100 text-purple-800 border-purple-200",
  cancelled: "bg-red-100 text-red-800 border-red-200"
};

const OrderDetailsDialog = ({ order, isOpen, onClose, onUpdateStatus }: OrderDetailsDialogProps) => {
  const [status, setStatus] = React.useState<OrderStatus>('pending');

  React.useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  if (!order) return null;

  const handleStatusChange = (value: string) => {
    setStatus(value as OrderStatus);
  };

  const handleUpdateStatus = () => {
    onUpdateStatus(order.id, status);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pedido #{order.id.split('-').pop()}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">Cliente</h3>
              <p>{order.customerName}</p>
              {order.customerPhone && <p className="text-sm text-muted-foreground">{order.customerPhone}</p>}
            </div>
            <div className="text-right">
              <h3 className="font-medium">Data do Pedido</h3>
              <p>{format(new Date(order.createdAt), 'dd/MM/yyyy')}</p>
              <p className="text-sm text-muted-foreground">{format(new Date(order.createdAt), 'HH:mm')}</p>
            </div>
          </div>
          
          {order.deliveryAddress && (
            <div>
              <h3 className="font-medium mb-1 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Endereço de Entrega
              </h3>
              <p className="text-sm">{order.deliveryAddress}</p>
            </div>
          )}
          
          {order.paymentMethod && (
            <div>
              <h3 className="font-medium mb-1 flex items-center gap-1">
                {order.paymentMethod === 'card' ? (
                  <CreditCard className="h-4 w-4 text-blue-600" />
                ) : (
                  <Banknote className="h-4 w-4 text-green-600" />
                )}
                Forma de Pagamento
              </h3>
              <p className="text-sm">
                {order.paymentMethod === 'card' 
                  ? 'Cartão de Crédito/Débito (na entrega)' 
                  : 'Dinheiro'}
              </p>
            </div>
          )}
          
          <div>
            <h3 className="font-medium mb-2">Itens do Pedido</h3>
            <div className="border rounded-md">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2 text-sm font-medium">Item</th>
                    <th className="text-center p-2 text-sm font-medium">Qtd</th>
                    <th className="text-right p-2 text-sm font-medium">Preço</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-2 text-sm">
                        <div>
                          {item.productName}
                          {item.removedIngredients && item.removedIngredients.length > 0 && (
                            <div className="text-xs text-amber-600 mt-1">
                              Sem: {item.removedIngredients.join(', ')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-2 text-sm text-center">{item.quantity}</td>
                      <td className="p-2 text-sm text-right">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</td>
                    </tr>
                  ))}
                  <tr className="border-t">
                    <td colSpan={2} className="p-2 text-sm font-medium text-right">Subtotal:</td>
                    <td className="p-2 text-sm text-right">R$ {(order.total - 5).toFixed(2).replace('.', ',')}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="p-2 text-sm font-medium text-right">Taxa de entrega:</td>
                    <td className="p-2 text-sm text-right">R$ 5,00</td>
                  </tr>
                  <tr className="border-t bg-muted/30">
                    <td colSpan={2} className="p-2 text-sm font-medium text-right">Total:</td>
                    <td className="p-2 text-sm font-bold text-right">R$ {order.total.toFixed(2).replace('.', ',')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Status do Pedido</h3>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={cn("text-sm px-2 py-1", statusColors[order.status])}>
                {order.status === 'pending' ? 'Pendente' : 
                 order.status === 'preparing' ? 'Em Preparo' : 
                 order.status === 'ready' ? 'Pronto' : 
                 order.status === 'delivered' ? 'Entregue' : 'Cancelado'}
              </Badge>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Atualizar status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="preparing">Em Preparo</SelectItem>
                  <SelectItem value="ready">Pronto</SelectItem>
                  <SelectItem value="delivered">Entregue</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button 
            className="bg-food-primary hover:bg-food-dark"
            onClick={handleUpdateStatus}
            disabled={status === order.status}
          >
            Atualizar Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
