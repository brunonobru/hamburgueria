import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, BarChart2, Settings, LogOut, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';

type SidebarLinkProps = {
  to: string;
  icon: React.ElementType;
  label: string;
};

const SidebarLink = ({ to, icon: Icon, label }: SidebarLinkProps) => {
  const location = useLocation();
  const { state } = useSidebar();
  const isActive = location.pathname === to;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild className={cn(
        "transition-all duration-200 group relative overflow-hidden",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground"
      )}>
        <Link to={to}>
          {isActive && state === "expanded" && (
            <span className="absolute inset-y-0 left-0 w-1 bg-food-primary rounded-r-full" />
          )}
          <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", 
            isActive ? "text-food-primary" : "text-sidebar-foreground/70")} />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const Sidebar = () => {
  const { logout } = useAuth();
  
  return (
    <SidebarContainer className="border-r border-sidebar-border">
      <SidebarHeader className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Utensils className="h-7 w-7 text-food-primary" />
          <h1 className="text-sidebar-foreground text-xl font-bold">FoodSaaS</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarMenu className="space-y-1">
          <SidebarLink to="/admin" icon={Home} label="Dashboard" />
          <SidebarLink to="/admin/products" icon={ShoppingBag} label="Produtos" />
          <SidebarLink to="/admin/orders" icon={BarChart2} label="Pedidos" />
          <SidebarLink to="/admin/settings" icon={Settings} label="Configurações" />
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={logout} 
              className="transition-all duration-200 text-sidebar-foreground/80 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground group"
            >
              <LogOut className="h-5 w-5 text-sidebar-foreground/70 transition-transform group-hover:scale-110 group-hover:text-red-400" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;