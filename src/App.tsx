import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { useAuth } from './hooks/useAuth';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { QuantumSimulator } from './pages/QuantumSimulator';
import { CircuitBuilderPage } from './pages/CircuitBuilderPage';
import { Settings } from './pages/Settings';
import { Analytics } from './pages/Analytics';
import { JavaScriptSDK } from './pages/JavaScriptSDK';
import { PythonSDK } from './pages/PythonSDK';
import SDKDocumentation from './pages/SDKDocumentation';
import { Pricing } from './pages/Pricing';
import { QuantumAlgorithmsPanelDemo } from './pages/QuantumAlgorithmsPanelDemo';
import { QuantumAlgorithmsSDK } from '@/components/sdk/QuantumAlgorithmsSDK';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quantum-simulator" element={<QuantumSimulator />} />
          <Route path="/circuit-builder" element={<CircuitBuilderPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/javascript-sdk" element={<JavaScriptSDK />} />
          <Route path="/python-sdk" element={<PythonSDK />} />
          <Route path="/sdk-docs" element={<SDKDocumentation />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/quantum-algorithms-panel-demo" element={<QuantumAlgorithmsPanelDemo />} />
          <Route path="/quantum-algorithms-sdk" element={<QuantumAlgorithmsSDK />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
