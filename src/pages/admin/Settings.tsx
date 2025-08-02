
import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import NotificationSettings from '@/components/settings/NotificationSettings';

const Settings = () => {
  const { user } = useAuth();
  
  const [businessName, setBusinessName] = useState('My Food Business');
  const [businessPhone, setBusinessPhone] = useState('(123) 456-7890');
  const [businessAddress, setBusinessAddress] = useState('123 Main St, City');
  
  const [openHours, setOpenHours] = useState('09:00');
  const [closeHours, setCloseHours] = useState('22:00');
  
  const [notifyNewOrders, setNotifyNewOrders] = useState(true);
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Perfil do negócio atualizado");
  };
  
  const handleSaveOperating = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Horários de funcionamento atualizados");
  };
  
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Configurações de notificação atualizadas");
  };
  
  return (
    <AdminLayout>
      <PageHeader 
        title="Configurações" 
        description="Gerencie as configurações do seu negócio"
      />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Perfil do Negócio</CardTitle>
            <CardDescription>
              Atualize as informações do seu negócio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nome do Negócio</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Número de Telefone</Label>
                  <Input
                    id="businessPhone"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessAddress">Endereço</Label>
                <Input
                  id="businessAddress"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                />
              </div>
              
              <div className="pt-2">
                <Button type="submit" className="bg-food-primary hover:bg-food-dark">
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Horário de Funcionamento</CardTitle>
            <CardDescription>
              Defina o horário do seu negócio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveOperating} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openHours">Horário de Abertura</Label>
                  <Input
                    id="openHours"
                    type="time"
                    value={openHours}
                    onChange={(e) => setOpenHours(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closeHours">Horário de Fechamento</Label>
                  <Input
                    id="closeHours"
                    type="time"
                    value={closeHours}
                    onChange={(e) => setCloseHours(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <Button type="submit" className="bg-food-primary hover:bg-food-dark">
                  Salvar Horários
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Componente avançado de configurações de notificação */}
        <NotificationSettings />
      </div>
    </AdminLayout>
  );
};

export default Settings;
