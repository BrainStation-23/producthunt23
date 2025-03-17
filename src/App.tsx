
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import UserLayout from "@/components/layout/UserLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Landing pages
import LandingPage from "@/pages/landing/LandingPage";

// Auth pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminUsers from "@/pages/admin/AdminUsers";

// User pages
import UserDashboard from "@/pages/user/UserDashboard";
import UserProfile from "@/pages/user/UserProfile";

// Error pages
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="products" element={<div className="container py-12">Products page (To be implemented)</div>} />
              <Route path="products/:id" element={<div className="container py-12">Product detail page (To be implemented)</div>} />
              <Route path="categories" element={<div className="container py-12">Categories page (To be implemented)</div>} />
              <Route path="categories/:category" element={<div className="container py-12">Category listing page (To be implemented)</div>} />
              <Route path="submit" element={<div className="container py-12">Submit product page (To be implemented)</div>} />
              <Route path="about" element={<div className="container py-12">About page (To be implemented)</div>} />
              <Route path="terms" element={<div className="container py-12">Terms page (To be implemented)</div>} />
              <Route path="privacy" element={<div className="container py-12">Privacy page (To be implemented)</div>} />
            </Route>
            
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<div>Forgot password page (To be implemented)</div>} />
            <Route path="/reset-password" element={<div>Reset password page (To be implemented)</div>} />
            
            {/* Admin routes - protected for admin role only */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="settings" element={<div>Admin settings (To be implemented)</div>} />
              </Route>
            </Route>
            
            {/* User routes - protected for any authenticated user */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'user']} />}>
              <Route path="/user" element={<UserLayout />}>
                <Route index element={<UserDashboard />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="products" element={<div>User products (To be implemented)</div>} />
                <Route path="saved" element={<div>Saved products (To be implemented)</div>} />
                <Route path="messages" element={<div>User messages (To be implemented)</div>} />
                <Route path="settings" element={<div>User settings (To be implemented)</div>} />
              </Route>
            </Route>
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
