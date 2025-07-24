
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { AuthGuard } from "@/components/AuthGuard";
import LandingPage from "@/pages/LandingPage";
import { HomePage } from "@/pages/HomePage";
import CircuitBuilder from "@/pages/CircuitBuilder";
import AuthPage from "@/pages/AuthPage";
import PythonSDKPage from "@/pages/PythonSDKPage";
import SDKDocumentation from "@/pages/SDKDocumentation";
import APIReference from "@/pages/APIReference";
import TutorialsPage from "@/pages/TutorialsPage";
import RoadmapPage from "@/pages/RoadmapPage";
import IntegrationsPage from "@/pages/IntegrationsPage";
import TestingPage from "@/pages/TestingPage";
import SharedCircuit from "@/pages/SharedCircuit";
import EmbedCircuit from "@/pages/EmbedCircuit";
import ThankYou from "@/pages/ThankYou";
import NotFound from "@/pages/NotFound";
import { QuantumDashboard } from "@/components/QuantumDashboard";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/python-sdk" element={<PythonSDKPage />} />
              <Route path="/sdk-docs" element={<SDKDocumentation />} />
              <Route path="/api-reference" element={<APIReference />} />
              <Route path="/tutorials" element={<TutorialsPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/integrations" element={<IntegrationsPage />} />
              <Route path="/testing" element={<TestingPage />} />
              <Route path="/shared/:id" element={<SharedCircuit />} />
              <Route path="/embed/:id" element={<EmbedCircuit />} />
              <Route path="/thank-you" element={<ThankYou />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <AuthGuard>
                  <HomePage />
                </AuthGuard>
              } />
              <Route path="/app" element={
                <AuthGuard>
                  <QuantumDashboard />
                </AuthGuard>
              } />
              <Route path="/circuit-builder" element={
                <AuthGuard>
                  <CircuitBuilder />
                </AuthGuard>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
