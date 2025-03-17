
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Index from "@/pages/Index";
import LandingPage from "@/pages/landing/LandingPage";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

import MainLayout from "@/components/layout/MainLayout";
import UserLayout from "@/components/layout/UserLayout";
import UserDashboard from "@/pages/user/UserDashboard";
import UserProfile from "@/pages/user/UserProfile";

import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminProducts from "@/pages/admin/AdminProducts";

import ProductsPage from "@/pages/products/ProductsPage";
import SubmitProductPage from "@/pages/products/SubmitProductPage";

import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Index />} />
              <Route path="landing" element={<LandingPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<div className="container py-12">Product detail page (To be implemented)</div>} />
              <Route path="categories" element={<div className="container py-12">Categories page (To be implemented)</div>} />
              <Route path="categories/:category" element={<div className="container py-12">Category listing page (To be implemented)</div>} />
              <Route path="submit" element={<SubmitProductPage />} />
              <Route path="about" element={<div className="container py-12">About page (To be implemented)</div>} />
              <Route path="terms" element={<div className="container py-12">Terms page (To be implemented)</div>} />
              <Route path="privacy" element={<div className="container py-12">Privacy page (To be implemented)</div>} />
            </Route>
            
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<div>Forgot password page (To be implemented)</div>} />
            <Route path="/reset-password" element={<div>Reset password page (To be implemented)</div>} />
            
            {/* User routes - Protected */}
            <Route element={<ProtectedRoute />}>
              <Route path="/user" element={<UserLayout />}>
                <Route index element={<UserDashboard />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="products" element={<div>User products (To be implemented)</div>} />
                <Route path="saved" element={<div>Saved products (To be implemented)</div>} />
                <Route path="messages" element={<div>User messages (To be implemented)</div>} />
                <Route path="settings" element={<div>User settings (To be implemented)</div>} />
              </Route>
            </Route>
            
            {/* Admin routes - Protected */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="settings" element={<div>Admin settings (To be implemented)</div>} />
              </Route>
            </Route>
            
            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster richColors />
    </QueryClientProvider>
  );
}

export default App;
