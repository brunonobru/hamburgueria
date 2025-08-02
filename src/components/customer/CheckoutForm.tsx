
import React from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { MapPin, CreditCard, Banknote } from 'lucide-react';

interface CheckoutFormProps {
  cartItems: { product: Product; quantity: number; removedIngredients?: string[] }[];
  isOpen: boolean;
  onClose: () => void;
  onSubmitOrder: (customerName: string, customerPhone: string, deliveryAddress: string, paymentMethod: string) => void;
}

const CheckoutForm = ({ cartItems, isOpen, onClose, onSubmitOrder }: CheckoutFormProps) => {
  const [customerName, setCustomerName] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [deliveryAddress, setDeliveryAddress] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState('cash');
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = 5; // R$ 5,00 fixed delivery fee
  const total = subtotal + deliveryFee;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      toast.error("Por favor, informe seu nome");
      return;
    }
    
    if (!deliveryAddress.trim()) {
      toast.error("Por favor, informe o endereço de entrega");
      return;
    }
    
    onSubmitOrder(customerName, customerPhone, deliveryAddress, paymentMethod);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar Pedido</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Seu Nome</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Informe seu nome"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Telefone</Label>
            <Input
              id="customerPhone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Informe seu telefone"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="deliveryAddress">Endereço de Entrega</Label>
            </div>
            <Input
              id="deliveryAddress"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Rua, número, bairro, complemento"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Forma de Pagamento</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="cash" id="payment-cash" />
                <Label htmlFor="payment-cash" className="flex items-center gap-2 font-normal cursor-pointer">
                  <Banknote className="h-4 w-4 text-green-600" />
                  <span>Dinheiro</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="card" id="payment-card" />
                <Label htmlFor="payment-card" className="flex items-center gap-2 font-normal cursor-pointer">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span>Cartão de Crédito/Débito (na entrega)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="rounded-md border p-4 space-y-2">
            <h3 className="font-medium">Resumo do Pedido</h3>
            <div className="space-y-1">
              {cartItems.map(({ product, quantity, removedIngredients }) => (
                <div key={product.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{quantity}x {product.name}</span>
                    <span>R$ {(product.price * quantity).toFixed(2).replace('.', ',')}</span>
                  </div>
                  {removedIngredients && removedIngredients.length > 0 && (
                    <div className="text-xs text-amber-600 ml-4">
                      Sem: {removedIngredients.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t pt-2 flex justify-between text-sm">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Taxa de entrega</span>
              <span>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#FF7A30] hover:bg-[#E66A20]">
              Confirmar Pedido
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutForm;
