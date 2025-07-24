
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import Index from './pages/Index';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import CircuitBuilder from './pages/CircuitBuilder';
import { QuantumSDK } from './pages/QuantumSDK';
import PythonSDKPage from './pages/PythonSDKPage';
import SDKDocumentation from './pages/SDKDocumentation';
import APIReference from './pages/APIReference';
import TutorialsPage from './pages/TutorialsPage';
import TestingPage from './pages/TestingPage';
import ThankYou from './pages/ThankYou';
import SharedCircuit from './pages/SharedCircuit';
import EmbedCircuit from './pages/EmbedCircuit';
import RoadmapPage from './pages/RoadmapPage';
import IntegrationsPage from './pages/IntegrationsPage';
import NotFound from './pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/circuit-builder" element={<CircuitBuilder />} />
                <Route path="/quantum-sdk" element={<QuantumSDK />} />
                <Route path="/python-sdk" element={<PythonSDKPage />} />
                <Route path="/sdk-docs" element={<SDKDocumentation />} />
                <Route path="/api-reference" element={<APIReference />} />
                <Route path="/tutorials" element={<TutorialsPage />} />
                <Route path="/testing" element={<TestingPage />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/shared-circuit/:id" element={<SharedCircuit />} />
                <Route path="/embed-circuit/:id" element={<EmbedCircuit />} />
                <Route path="/roadmap" element={<RoadmapPage />} />
                <Route path="/integrations" element={<IntegrationsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
