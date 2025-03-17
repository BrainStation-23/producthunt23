
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import LandingPage from "@/pages/landing/LandingPage";

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
            <Route path="/" element={<Index />} />
            <Route path="/landing" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Main Layout Routes */}
            <Route element={<MainLayout />}>
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/submit" element={<SubmitProductPage />} />
            </Route>

            {/* User Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/profile" element={<UserProfile />} />
            </Route>

            {/* Admin Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/products" element={<AdminProducts />} />
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
