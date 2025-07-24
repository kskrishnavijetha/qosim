
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthGuard } from "./components/AuthGuard";
import { QuantumDashboard } from "./components/QuantumDashboard";

const CircuitBuilder = lazy(() => import("./pages/CircuitBuilder"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const TutorialsPage = lazy(() => import("./pages/TutorialsPage"));
const SDKDocumentation = lazy(() => import("./pages/SDKDocumentation"));
const PythonSDKPage = lazy(() => import("./pages/PythonSDKPage"));
const APIReference = lazy(() => import("./pages/APIReference"));
const RoadmapPage = lazy(() => import("./pages/RoadmapPage"));
const IntegrationsPage = lazy(() => import("./pages/IntegrationsPage"));
const TestingPage = lazy(() => import("./pages/TestingPage"));
const SharedCircuit = lazy(() => import("./pages/SharedCircuit"));
const EmbedCircuit = lazy(() => import("./pages/EmbedCircuit"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/app" element={
                  <AuthGuard>
                    <QuantumDashboard />
                  </AuthGuard>
                } />
                <Route path="/circuit-builder" element={<CircuitBuilder />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/tutorials" element={<TutorialsPage />} />
                <Route path="/sdk" element={<SDKDocumentation />} />
                <Route path="/python-sdk" element={<PythonSDKPage />} />
                <Route path="/api" element={<APIReference />} />
                <Route path="/roadmap" element={<RoadmapPage />} />
                <Route path="/integrations" element={<IntegrationsPage />} />
                <Route path="/testing" element={<TestingPage />} />
                <Route path="/shared/:id" element={<SharedCircuit />} />
                <Route path="/embed/:id" element={<EmbedCircuit />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
