
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { NavBar } from "@/components/NavBar";
import Index from "@/pages/Index";
import Builder from "@/pages/Builder";
import SDK from "@/pages/SDK";
import { QuantumDashboard } from "@/components/QuantumDashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-quantum-void">
        <NavBar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/sdk" element={<SDK />} />
          <Route path="/dashboard" element={<QuantumDashboard />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
