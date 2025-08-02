
import React from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from '@/components/sidebar/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { useOrderNotifications } from '@/hooks/useOrderNotifications';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isLoading, isAdmin } = useAuth();
  
  // Enable order notifications for admins
  useOrderNotifications();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-food-primary/20 mx-auto animate-spin border-2 border-food-primary border-t-transparent"></div>
          <div className="text-xl font-medium text-muted-foreground">Carregando...</div>
        </div>
      </div>
    );
  }
  
  // Redirect if not logged in or not an admin
  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-muted/30 to-background">
        <Sidebar />
        
        <div className="flex flex-1 flex-col">
          <header className="h-12 flex items-center border-b bg-background/50 backdrop-blur-sm">
            <SidebarTrigger className="ml-4" />
          </header>
          
          <main className="flex-1 p-4 lg:p-6 transition-all duration-300 bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto animate-fade-in max-w-7xl">
              {children}
            </div>
          </main>
        </div>
        
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
