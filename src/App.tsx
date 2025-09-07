
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import SharedCircuit from "./pages/SharedCircuit";
import EmbedCircuit from "./pages/EmbedCircuit";
import TutorialsPage from "./pages/TutorialsPage";
import RoadmapPage from "./pages/RoadmapPage";
import SDKDocumentation from "./pages/SDKDocumentation";
import PythonSDKPage from "./pages/PythonSDKPage";
import APIReference from "./pages/APIReference";
import IntegrationsPage from "./pages/IntegrationsPage";
import TestingPage from "./pages/TestingPage";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { GlobalErrorBoundary } from "./components/error-handling/GlobalErrorBoundary";
import { QuantumErrorHandler } from "./components/error-handling/QuantumErrorHandler";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: (failureCount, error) => {
        console.log(`Query retry attempt ${failureCount}:`, error);
        return failureCount < 3;
      },
    },
  },
});

function App() {
  console.log('🚀 App component rendering...');

  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <AuthProvider>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/app" element={<Index />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/circuit/:id" element={<SharedCircuit />} />
                  <Route path="/embed/:id" element={<EmbedCircuit />} />
                  <Route path="/tutorials" element={<TutorialsPage />} />
                  <Route path="/roadmap" element={<RoadmapPage />} />
                  <Route path="/sdk" element={<SDKDocumentation />} />
                  <Route path="/python-sdk" element={<PythonSDKPage />} />
                  <Route path="/api" element={<APIReference />} />
                  <Route path="/integrations" element={<IntegrationsPage />} />
                  <Route path="/testing" element={<TestingPage />} />
                  <Route path="/thank-you" element={<ThankYou />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
        <QuantumErrorHandler />
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
