
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import UserLayout from './components/layout/UserLayout';

// Public Pages
import Index from './pages/Index';
import LandingPage from './pages/landing/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProductsPage from './pages/products/ProductsPage';
import SubmitProductPage from './pages/products/SubmitProductPage';
import EditProductPage from './pages/products/EditProductPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import UserProducts from './pages/user/UserProducts';
import UserSettings from './pages/user/UserSettings';

// Create a client
const queryClient = new QueryClient();

// Add devicon CSS
const deviconLink = document.createElement('link');
deviconLink.rel = 'stylesheet';
deviconLink.href = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css';
document.head.appendChild(deviconLink);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/" element={<MainLayout />}>
              <Route path="landing" element={<LandingPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/submit" element={<SubmitProductPage />} />
              <Route path="products/edit/:productId" element={<EditProductPage />} />
              <Route path="products/:productId" element={<ProductDetailPage />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/edit/:productId" element={<EditProductPage />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* User Routes */}
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<UserDashboard />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="products" element={<UserProducts />} />
              <Route path="settings" element={<UserSettings />} />
              <Route path="saved" element={<UserDashboard />} />
              <Route path="messages" element={<UserDashboard />} />
            </Route>

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
