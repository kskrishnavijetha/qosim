
export function useCustomGates() {
  return {
    customGates: [],
    addCustomGate: () => {},
    removeCustomGate: () => {},
    getCustomGate: () => ({}),
    isCustomGate: (gateType: string) => false
  };
}
