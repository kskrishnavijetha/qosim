
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import { SharedCircuit } from "./pages/SharedCircuit";
import { EmbedCircuit } from "./pages/EmbedCircuit";
import NotFound from "./pages/NotFound";
import ThankYou from "./pages/ThankYou";
import IntegrationsPage from "./pages/IntegrationsPage";
import SDKDocumentation from "./pages/SDKDocumentation";
import PythonSDKPage from "./pages/PythonSDKPage";
import APIReference from "./pages/APIReference";
import TutorialsPage from "./pages/TutorialsPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
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
              <Route path="/sdk" element={<SDKDocumentation />} />
              <Route path="/python-sdk" element={<PythonSDKPage />} />
              <Route path="/docs/api" element={<APIReference />} />
              <Route path="/tutorials" element={<TutorialsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
