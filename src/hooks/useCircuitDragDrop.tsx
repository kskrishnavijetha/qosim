
export function useCircuitDragDrop(options: any) {
  return {
    isDragging: false,
    handleDragStart: () => {},
    handleDragEnd: () => {},
    handleDrop: () => {},
    dragState: { isDragging: false, gateType: null, position: null },
    circuitRef: { current: null },
    handleMouseDown: () => {},
    handleTouchStart: () => {}
  };
}
