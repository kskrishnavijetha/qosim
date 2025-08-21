
import { Circuit, GateOp, validate } from './types';

export function toOpenQASM(c: Circuit): string {
  const errs = validate(c);
  if (errs.length) throw new Error("Invalid circuit:\n" + errs.join("\n"));

  const n = c.qubits;
  const m = c.cbits ?? n;
  const map = (g: GateOp): string[] => {
    const t = g.targets;
    const ctrl = g.controls ?? [];
    const p = g.params ?? {};
    const q = (i: number) => `q[${i}]`;

    // Helpers for common gates
    const one = (name: string) => [`${name} ${q(t[0])};`];
    const rot = (name: string, angleKey = "theta") => [`${name}(${p[angleKey] ?? 0}) ${q(t[0])};`];
    const cuPhase = () => [`cp(${p.theta ?? 0}) ${q(ctrl[0])},${q(t[0])};`];

    switch (g.type.toUpperCase()) {
      case "I": return one("id");
      case "X": return one("x");
      case "Y": return one("y");
      case "Z": return one("z");
      case "H": return one("h");
      case "S": return one("s");
      case "SDG": return one("sdg");
      case "T": return one("t");
      case "TDG": return one("tdg");
      case "RX": return rot("rx");
      case "RY": return rot("ry");
      case "RZ": return rot("rz");
      case "U1": return [`u1(${p.lam ?? 0}) ${q(t[0])};`];
      case "U2": return [`u2(${p.phi ?? 0},${p.lam ?? 0}) ${q(t[0])};`];
      case "U3": return [`u3(${p.theta ?? 0},${p.phi ?? 0},${p.lam ?? 0}) ${q(t[0])};`];
      case "CX":
      case "CNOT": return [`cx ${q(ctrl[0])},${q(t[0])};`];
      case "CY": return [`cy ${q(ctrl[0])},${q(t[0])};`];
      case "CZ": return [`cz ${q(ctrl[0])},${q(t[0])};`];
      case "CP": return cuPhase();
      case "SWAP": return [`swap ${q(t[0])},${q(t[1])};`];
      case "ISWAP": return [`// iSWAP not native in qelib1; expand or use custom lib`];
      case "CCX":
      case "TOFFOLI": return [`ccx ${q(ctrl[0])},${q(ctrl[1])},${q(t[0])};`];
      case "CSWAP":
      case "FREDKIN": return [`cswap ${q(ctrl[0])},${q(t[0])},${q(t[1])};`];
      case "RESET": return [`reset ${q(t[0])};`];
      case "MEASURE": return [`measure ${q(t[0])} -> c[${t[0]}];`];
      default: return [`// Unknown gate ${g.type}`];
    }
  };

  const body = c.gates.flatMap(map).join("\n");

  return [
    "OPENQASM 2.0;",
    'include "qelib1.inc";',
    `qreg q[${n}];`,
    `creg c[${m}];`,
    body,
    // Optional: measure all if none present
    c.gates.some(g => g.type.toUpperCase() === "MEASURE")
      ? ""
      : "measure q -> c;"
  ].filter(Boolean).join("\n") + "\n";
}
