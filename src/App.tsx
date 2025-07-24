
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QuantumAlgorithmsSDK } from '@/components/sdk/QuantumAlgorithmsSDK';
import { QuantumOSLayout } from '@/components/layout/QuantumOSLayout';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={
            <QuantumOSLayout>
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-quantum-glow mb-4">Welcome to QOSim</h1>
                  <p className="text-quantum-particle">Quantum Operating System for Simulation</p>
                </div>
              </div>
            </QuantumOSLayout>
          } />
          <Route path="/quantum-algorithms-sdk" element={
            <QuantumOSLayout>
              <QuantumAlgorithmsSDK />
            </QuantumOSLayout>
          } />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
