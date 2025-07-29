
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import { QOSim } from "./pages/QOSim";

const queryClient = new QueryClient();

function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/qosim" element={<QOSim />} />
            </Routes>
            <Toaster />
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default AppRouter;
