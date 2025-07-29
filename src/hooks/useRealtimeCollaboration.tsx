
import { useState } from 'react';

export function useRealtimeCollaboration() {
  const [isConnected] = useState(false);
  const [collaborators] = useState([]);
  
  return {
    isConnected,
    collaborators,
    connect: () => {},
    disconnect: () => {},
    sendMessage: () => {}
  };
}
