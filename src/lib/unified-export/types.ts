
// QOSim unified circuit model - source of truth
export type GateOp = {
  type: string;                 // "H","X","CX","RZ","MEASURE",...
  targets: number[];            // e.g. [0] or [1,2]
  controls?: number[];          // e.g. [0]
  params?: Record<string, number>; // {theta: 1.5708, phi: ..., lam: ...}
  label?: string;               // optional name
  layer?: number;               // for UI placement (optional)
};

export type Circuit = {
  name: string;
  qubits: number;               // n
  cbits?: number;               // defaults to n
  gates: GateOp[];
  metadata?: Record<string, any>;
};

// Validation helper
export function validate(c: Circuit): string[] {
  const errs: string[] = [];
  const n = c.qubits, m = c.cbits ?? c.qubits;
  if (!Number.isInteger(n) || n <= 0) errs.push("Invalid qubit count.");
  c.gates.forEach((g, i) => {
    const all = [...(g.controls ?? []), ...g.targets];
    if (!g.type) errs.push(`Gate[${i}] missing type.`);
    if (!g.targets?.length) errs.push(`Gate[${i}] has no targets.`);
    all.forEach(q => {
      if (!Number.isInteger(q) || q < 0 || q >= n) errs.push(`Gate[${i}] qubit index ${q} out of range.`);
    });
  });
  return errs;
}
