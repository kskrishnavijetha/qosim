import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import ThankYou from "./pages/ThankYou";
import Index from "./pages/Index";
import IntegrationsPage from "./pages/IntegrationsPage";
import PythonSDKPage from "./pages/PythonSDKPage";
import SDKDocumentation from "./pages/SDKDocumentation";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import { SharedCircuit } from "./pages/SharedCircuit";
import { EmbedCircuit } from "./pages/EmbedCircuit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/app" element={<Index />} />
              <Route path="/integrations" element={<IntegrationsPage />} />
              <Route path="/python-sdk" element={<PythonSDKPage />} />
              <Route path="/sdk-docs" element={<SDKDocumentation />} />
              <Route path="/shared/:fileId" element={<SharedCircuit />} />
              <Route path="/embed/:fileId" element={<EmbedCircuit />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
