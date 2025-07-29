
export function useCircuitDragDrop() {
  return {
    isDragging: false,
    handleDragStart: () => {},
    handleDragEnd: () => {},
    handleDrop: () => {},
    dragState: {
      isDragging: false,
      gateType: "",
      dragPosition: { x: 0, y: 0 },
      hoverQubit: null,
      hoverPosition: null
    },
    circuitRef: { current: null },
    handleMouseDown: () => {},
    handleTouchStart: () => {}
  };
}
