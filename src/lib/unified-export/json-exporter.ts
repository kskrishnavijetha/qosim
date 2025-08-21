
import { Circuit, validate } from './types';

export function toJSON(c: Circuit): string {
  const errs = validate(c);
  if (errs.length) throw new Error("Invalid circuit:\n" + errs.join("\n"));

  const out = {
    name: c.name || "Untitled Circuit",
    qubits: c.qubits,
    cbits: c.cbits ?? c.qubits,
    gates: c.gates.map(g => ({
      type: g.type,
      targets: g.targets,
      controls: g.controls ?? [],
      params: g.params ?? {},
      label: g.label ?? undefined,
      layer: g.layer ?? undefined
    })),
    metadata: { ...(c.metadata ?? {}) }
  };
  return JSON.stringify(out, null, 2);
}
