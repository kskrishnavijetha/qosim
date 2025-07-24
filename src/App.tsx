
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { DragDropProvider } from '@/contexts/DragDropContext';
import Index from '@/pages/Index';
import CircuitBuilder from '@/pages/CircuitBuilder';
import { QuantumSDK } from '@/pages/QuantumSDK';
import PythonSDKPage from '@/pages/PythonSDKPage';
import SDKDocumentation from '@/pages/SDKDocumentation';
import APIReference from '@/pages/APIReference';
import TutorialsPage from '@/pages/TutorialsPage';
import AuthPage from '@/pages/AuthPage';
import ThankYou from '@/pages/ThankYou';
import SharedCircuit from '@/pages/SharedCircuit';
import EmbedCircuit from '@/pages/EmbedCircuit';
import TestingPage from '@/pages/TestingPage';
import IntegrationsPage from '@/pages/IntegrationsPage';
import RoadmapPage from '@/pages/RoadmapPage';
import LandingPage from '@/pages/LandingPage';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <DragDropProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/circuit-builder" element={<CircuitBuilder />} />
                <Route path="/sdk" element={<QuantumSDK />} />
                <Route path="/quantum-sdk" element={<QuantumSDK />} />
                <Route path="/python-sdk" element={<PythonSDKPage />} />
                <Route path="/sdk-docs" element={<SDKDocumentation />} />
                <Route path="/api-reference" element={<APIReference />} />
                <Route path="/tutorials" element={<TutorialsPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/shared/:circuitId" element={<SharedCircuit />} />
                <Route path="/embed/:circuitId" element={<EmbedCircuit />} />
                <Route path="/testing" element={<TestingPage />} />
                <Route path="/integrations" element={<IntegrationsPage />} />
                <Route path="/roadmap" element={<RoadmapPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
          </DragDropProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
