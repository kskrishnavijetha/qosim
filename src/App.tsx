
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import RoadmapPage from "./pages/RoadmapPage";
import AuthPage from "./pages/AuthPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import SDKDocumentation from "./pages/SDKDocumentation";
import PythonSDKPage from "./pages/PythonSDKPage";
import APIReference from "./pages/APIReference";
import TutorialsPage from "./pages/TutorialsPage";
import ThankYou from "./pages/ThankYou";
import SharedCircuit from "./pages/SharedCircuit";
import EmbedCircuit from "./pages/EmbedCircuit";
import TestingPage from "./pages/TestingPage";
import NotFound from "./pages/NotFound";

// Create QueryClient instance with proper configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/app" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/integrations" element={<IntegrationsPage />} />
              <Route path="/sdk" element={<SDKDocumentation />} />
              <Route path="/python-sdk" element={<PythonSDKPage />} />
              <Route path="/api" element={<APIReference />} />
              <Route path="/tutorials" element={<TutorialsPage />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/testing" element={<TestingPage />} />
              <Route path="/circuit/:id" element={<SharedCircuit />} />
              <Route path="/embed/:id" element={<EmbedCircuit />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
