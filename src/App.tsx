
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QuantumCircuitBuilder } from './components/QuantumCircuitBuilder';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="qosim-ui-theme">
      <TooltipProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<QuantumCircuitBuilder />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
