
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RoleProvider } from './contexts/RoleContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';
import AuthCallback from './pages/auth/AuthCallback';
import LogoutPage from './pages/auth/LogoutPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLeaderboard from './pages/admin/AdminLeaderboard';
import AdminActivity from './pages/admin/AdminActivity';
import AdminSavedProducts from './pages/admin/AdminSavedProducts';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import UserLayout from './components/layout/UserLayout';
import JudgeLayout from './components/layout/JudgeLayout';

// Public Pages
import Index from './pages/Index';
import LandingPage from './pages/landing/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import MagicLinkPage from './pages/auth/MagicLinkPage'; // New import
import ProductsPage from './pages/products/ProductsPage';
import SubmitProductPage from './pages/products/SubmitProductPage';
import EditProductPage from './pages/products/EditProductPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import CertificationPage from './pages/products/CertificationPage';
import NotFound from './pages/NotFound';
import TermsOfServicePage from './pages/legal/TermsOfServicePage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminProfile from './pages/admin/AdminProfile';
import AdminJudging from './pages/admin/AdminJudging';
import AdminScoring from './pages/admin/AdminScoring';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import UserProducts from './pages/user/UserProducts';
import UserSettings from './pages/user/UserSettings';
import SavedProductsPage from './pages/user/SavedProductsPage';

// Judge Pages
import JudgeDashboard from './pages/judge/JudgeDashboard';
import ProductEvaluation from './pages/judge/ProductEvaluation';
import JudgeEvaluations from './pages/judge/JudgeEvaluations';

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
          <RoleProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Public routes */}
              <Route path="/" element={<MainLayout />}>
                <Route path="landing" element={<LandingPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:productId" element={<ProductDetailPage />} />
                <Route path="products/:productId/certificate" element={<CertificationPage />} />
                <Route path="terms" element={<TermsOfServicePage />} />
                <Route path="privacy" element={<PrivacyPolicyPage />} />
              </Route>

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/magic-link" element={<MagicLinkPage />} /> {/* New route */}
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/logout" element={<LogoutPage />} />

              {/* Admin routes - protected by role */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/submit" element={<SubmitProductPage />} />
                  <Route path="products/edit/:productId" element={<EditProductPage />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="profile" element={<AdminProfile />} />
                  <Route path="judging" element={<AdminJudging />} />
                  <Route path="scoring" element={<AdminScoring />} />
                  <Route path="leaderboard" element={<AdminLeaderboard />} />
                  <Route path="activity" element={<AdminActivity />} />
                  <Route path="saved" element={<AdminSavedProducts />} />
                </Route>
              </Route>

              {/* Judge routes - protected by role */}
              <Route element={<ProtectedRoute requiredRole="judge" />}>
                <Route path="/judge" element={<JudgeLayout />}>
                  <Route index element={<JudgeDashboard />} />
                  <Route path="evaluations" element={<JudgeEvaluations />} />
                  <Route path="evaluations/:productId" element={<ProductEvaluation />} />
                  <Route path="profile" element={<UserProfile />} />
                  <Route path="settings" element={<UserSettings />} />
                </Route>
              </Route>

              {/* User routes - protected by role */}
              <Route element={<ProtectedRoute requiredRole="user" />}>
                <Route path="/user" element={<UserLayout />}>
                  <Route index element={<UserDashboard />} />
                  <Route path="profile" element={<UserProfile />} />
                  <Route path="products" element={<UserProducts />} />
                  <Route path="products/submit" element={<SubmitProductPage />} />
                  <Route path="products/edit/:productId" element={<EditProductPage />} />
                  <Route path="settings" element={<UserSettings />} />
                  <Route path="saved" element={<SavedProductsPage />} />
                </Route>
              </Route>

              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
            <Toaster />
          </RoleProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
