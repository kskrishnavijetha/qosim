import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthGuard } from "@/components/AuthGuard";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import SharedCircuit from "./pages/SharedCircuit";
import EmbedCircuit from "./pages/EmbedCircuit";
import TutorialsPage from "./pages/TutorialsPage";
import RoadmapPage from "./pages/RoadmapPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import SDKDocumentation from "./pages/SDKDocumentation";
import PythonSDKPage from "./pages/PythonSDKPage";
import TestingPage from "./pages/TestingPage";
import APIReference from "./pages/APIReference";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        console.error('Query failed:', error);
        return failureCount < 3;
      },
    },
  },
});

function App() {
  console.log('App component rendering...');

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider>
            <BrowserRouter>
              <AuthProvider>
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={
                      <ErrorBoundary>
                        <Index />
                      </ErrorBoundary>
                    } />
                    <Route path="/auth" element={
                      <ErrorBoundary>
                        <AuthPage />
                      </ErrorBoundary>
                    } />
                    <Route path="/landing" element={
                      <ErrorBoundary>
                        <LandingPage />
                      </ErrorBoundary>
                    } />
                    <Route path="/shared/:circuitId" element={
                      <ErrorBoundary>
                        <SharedCircuit />
                      </ErrorBoundary>
                    } />
                    <Route path="/embed/:circuitId" element={
                      <ErrorBoundary>
                        <EmbedCircuit />
                      </ErrorBoundary>
                    } />
                    <Route path="/tutorials" element={
                      <ErrorBoundary>
                        <TutorialsPage />
                      </ErrorBoundary>
                    } />
                    <Route path="/roadmap" element={
                      <ErrorBoundary>
                        <RoadmapPage />
                      </ErrorBoundary>
                    } />
                    <Route path="/integrations" element={
                      <ErrorBoundary>
                        <IntegrationsPage />
                      </ErrorBoundary>
                    } />
                    <Route path="/sdk" element={
                      <ErrorBoundary>
                        <SDKDocumentation />
                      </ErrorBoundary>
                    } />
                    <Route path="/python-sdk" element={
                      <ErrorBoundary>
                        <PythonSDKPage />
                      </ErrorBoundary>
                    } />
                    <Route path="/testing" element={
                      <ErrorBoundary>
                        <TestingPage />
                      </ErrorBoundary>
                    } />
                    <Route path="/api" element={
                      <ErrorBoundary>
                        <APIReference />
                      </ErrorBoundary>
                    } />
                    <Route path="/thank-you" element={
                      <ErrorBoundary>
                        <ThankYou />
                      </ErrorBoundary>
                    } />
                    <Route path="*" element={
                      <ErrorBoundary>
                        <NotFound />
                      </ErrorBoundary>
                    } />
                  </Routes>
                </ErrorBoundary>
                <Toaster />
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
