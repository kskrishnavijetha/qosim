
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import CircuitBuilder from './pages/CircuitBuilder';
import { QuantumSDK } from './pages/QuantumSDK';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/circuit-builder" element={<CircuitBuilder />} />
          <Route path="/sdk" element={<QuantumSDK />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
