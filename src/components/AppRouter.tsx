
import { Routes, Route } from 'react-router-dom';
import { AuthGuard } from '@/components/AuthGuard';
import { QuantumDashboard } from '@/components/QuantumDashboard';
import AuthPage from '@/pages/AuthPage';
import Index from '@/pages/Index';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/app" element={
        <AuthGuard>
          <QuantumDashboard />
        </AuthGuard>
      } />
      <Route path="/" element={<Index />} />
    </Routes>
  );
}
