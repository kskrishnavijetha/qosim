
import { useState, useCallback, useRef } from 'react';

interface ZoomPanState {
  zoomLevel: number;
  panOffset: { x: number; y: number };
  isPanning: boolean;
  lastPanPoint: { x: number; y: number };
}

export function useZoomPan(containerRef: React.RefObject<HTMLElement>) {
  const [state, setState] = useState<ZoomPanState>({
    zoomLevel: 1,
    panOffset: { x: 0, y: 0 },
    isPanning: false,
    lastPanPoint: { x: 0, y: 0 }
  });

  const handleZoomIn = useCallback(() => {
    setState(prev => ({
      ...prev,
      zoomLevel: Math.min(prev.zoomLevel * 1.2, 3)
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setState(prev => ({
      ...prev,
      zoomLevel: Math.max(prev.zoomLevel / 1.2, 0.1)
    }));
  }, []);

  const handlePanStart = useCallback((e: React.MouseEvent) => {
    setState(prev => ({
      ...prev,
      isPanning: true,
      lastPanPoint: { x: e.clientX, y: e.clientY }
    }));
  }, []);

  const handlePanMove = useCallback((e: React.MouseEvent) => {
    if (!state.isPanning) return;

    const deltaX = e.clientX - state.lastPanPoint.x;
    const deltaY = e.clientY - state.lastPanPoint.y;

    setState(prev => ({
      ...prev,
      panOffset: {
        x: prev.panOffset.x + deltaX,
        y: prev.panOffset.y + deltaY
      },
      lastPanPoint: { x: e.clientX, y: e.clientY }
    }));
  }, [state.isPanning, state.lastPanPoint]);

  const handlePanEnd = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPanning: false
    }));
  }, []);

  const resetView = useCallback(() => {
    setState(prev => ({
      ...prev,
      zoomLevel: 1,
      panOffset: { x: 0, y: 0 }
    }));
  }, []);

  return {
    zoomLevel: state.zoomLevel,
    panOffset: state.panOffset,
    isPanning: state.isPanning,
    handleZoomIn,
    handleZoomOut,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    resetView
  };
}
