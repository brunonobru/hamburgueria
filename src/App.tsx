
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationSettingsProvider } from "@/contexts/NotificationSettingsContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import React from "react";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Settings from "./pages/admin/Settings";
import Auth from "./pages/auth/Auth";

// Customer Pages
import StoreFront from "./pages/customer/StoreFront";
import OrderSuccess from "./pages/customer/OrderSuccess";
import OrderTracking from "./pages/customer/OrderTracking";

// Create a new QueryClient instance inside the component
const App = () => {
  // Create a client inside the component function
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationSettingsProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<StoreFront />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/track-order" element={<OrderTracking />} />
              
              {/* Admin Routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <ProtectedRoute requireAdmin>
                  <Products />
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute requireAdmin>
                  <Orders />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute requireAdmin>
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* Redirect to home page for any undefined routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationSettingsProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
