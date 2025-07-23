import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages';
import CircuitBuilder from './pages/CircuitBuilder';
import { QuantumSDK } from '@/pages/QuantumSDK';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/circuit-builder" element={<CircuitBuilder />} />
        <Route path="/sdk" element={<QuantumSDK />} />
      </Routes>
    </Router>
  );
}

export default App;
