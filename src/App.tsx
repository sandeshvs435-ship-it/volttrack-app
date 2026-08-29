import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/auth';
import ErrorBoundary from '@/components/ErrorBoundary';
import Layout from '@/components/Layout';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Fleet from '@/pages/Fleet';
import Analytics from '@/pages/Analytics';
import Alerts from '@/pages/Alerts';
import Billing from '@/pages/Billing';
import Contracts from '@/pages/Contracts';
import Settings from '@/pages/Settings';

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
              <Route path="/fleet" element={<ErrorBoundary><Fleet /></ErrorBoundary>} />
              <Route path="/analytics" element={<ErrorBoundary><Analytics /></ErrorBoundary>} />
              <Route path="/alerts" element={<ErrorBoundary><Alerts /></ErrorBoundary>} />
              <Route path="/billing" element={<ErrorBoundary><Billing /></ErrorBoundary>} />
              <Route path="/contracts" element={<ErrorBoundary><Contracts /></ErrorBoundary>} />
              <Route path="/settings" element={<ErrorBoundary><Settings /></ErrorBoundary>} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
