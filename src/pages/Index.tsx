
import { useAuth } from '@/contexts/AuthContext';
import AuthPage from './AuthPage';
import { MainQuantumInterface } from '@/components/MainQuantumInterface';
import { Skeleton } from '@/components/ui/skeleton';

export default function Index() {
  console.log('📄 Index page rendering...');
  
  const { user, loading } = useAuth();
  
  console.log('🔍 Index - Auth state:', { user: user?.id || 'null', loading });

  if (loading) {
    console.log('⏳ Index - Showing loading skeleton');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-96">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-8 w-3/4" />
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('👤 Index - No user, showing auth page');
    return <AuthPage />;
  }

  console.log('✅ Index - User authenticated, showing main interface');
  return (
    <div className="min-h-screen bg-background">
      <MainQuantumInterface />
    </div>
  );
}
