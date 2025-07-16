
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import SharedCircuit from "./pages/SharedCircuit";
import EmbedCircuit from "./pages/EmbedCircuit";
import NotFound from "./pages/NotFound";
import ThankYou from "./pages/ThankYou";
import IntegrationsPage from "./pages/IntegrationsPage";
import SDKDocumentation from "./pages/SDKDocumentation";
import PythonSDKPage from "./pages/PythonSDKPage";
import APIReference from "./pages/APIReference";

const queryClient = new QueryClient();

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
              <Route path="/app" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/circuit/:id" element={<SharedCircuit />} />
              <Route path="/embed/:id" element={<EmbedCircuit />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/integrations" element={<IntegrationsPage />} />
              <Route path="/docs" element={<SDKDocumentation />} />
              <Route path="/docs/api" element={<APIReference />} />
              <Route path="/python-sdk" element={<PythonSDKPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
