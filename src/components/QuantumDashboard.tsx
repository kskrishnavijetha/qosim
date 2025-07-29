import React, { useState } from 'react';
import { DashboardPanel } from './panels/DashboardPanel';
import { CircuitsPanel } from './panels/CircuitsPanel';
import { QuantumAlgorithmsSDKPanel } from './panels/QuantumAlgorithmsSDKPanel';

export function QuantumDashboard() {
  const [currentPanel, setCurrentPanel] = useState('dashboard');
  const [selectedSDKType, setSelectedSDKType] = useState<string>('javascript');

  const renderPanel = () => {
    switch (currentPanel) {
      case 'dashboard':
        return <DashboardPanel />;
      case 'circuits':
        return <CircuitsPanel />;
      case 'algorithms-sdk':
        return <QuantumAlgorithmsSDKPanel />;
      default:
        return <DashboardPanel />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {renderPanel()}
    </div>
  );
}
