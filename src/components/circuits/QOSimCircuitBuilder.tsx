
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X as XIcon, Play, Trash2 } from "lucide-react";

/**
 * QOSim Circuit Builder (Debug-Ready)
 * - Single-file React component
 * - Gate registry + validation (no more `undefined` targets)
 * - Non-blocking toast errors + inline highlights
 * - ASCII-style circuit preview
 * - Safe defaults: prevents out-of-range qubits, missing control, etc.
 *
 * Drop into any React app. Uses Tailwind classes for styling.
 */
export default function QOSimCircuitBuilder() {
  // --- Configurable counts ---
  const [numQubits, setNumQubits] = useState(2);

  // --- Circuit state ---
  /** step = { id, type, targets: number[], control?: number } */
  const [steps, setSteps] = useState([]);
  const [toast, setToast] = useState(null);

  // ---- Gate registry (extend freely) ----
  const gates = useMemo(
    () => ({
      H: { label: "H", arity: 1 },
      X: { label: "X", arity: 1 },
      Z: { label: "Z", arity: 1 },
      S: { label: "S", arity: 1 },
      T: { label: "T", arity: 1 },
      RX: { label: "RX(θ)", arity: 1, params: ["theta"] },
      RY: { label: "RY(θ)", arity: 1, params: ["theta"] },
      RZ: { label: "RZ(θ)", arity: 1, params: ["theta"] },
      CX: { label: "CNOT", arity: 2, needsControl: true },
      CZ: { label: "CZ", arity: 2, needsControl: true },
      SWAP: { label: "SWAP", arity: 2 },
      MEASURE: { label: "Measure", arity: 1 },
      I: { label: "I", arity: 1 },
    }),
    []
  );

  // --- Form state for adding a gate ---
  const [selectedGate, setSelectedGate] = useState("H");
  const [targetA, setTargetA] = useState(0);
  const [targetB, setTargetB] = useState(1);
  const [control, setControl] = useState(0);
  const [theta, setTheta] = useState(Math.PI / 4);

  const showError = (msg) => {
    setToast({ type: "error", msg });
    // Auto hide
    setTimeout(() => setToast(null), 4000);
  };

  // --- Validation helpers ---
  const isValidQubit = (q) => Number.isInteger(q) && q >= 0 && q < numQubits;

  const addGate = () => {
    const def = gates[selectedGate];
    if (!def) return showError(`Unknown gate type: ${selectedGate}`);

    const needsTwo = def.arity === 2;
    const needsControl = !!def.needsControl;

    // derive targets list
    const a = Number(targetA);
    const b = Number(targetB);
    const c = Number(control);

    if (!isValidQubit(a)) return showError("Target qubit A is invalid/out of range.");

    const payload = { id: crypto.randomUUID(), type: selectedGate, targets: [a] };

    if (def.params?.includes("theta")) {
      if (!Number.isFinite(theta)) return showError("Theta must be a finite number.");
      payload.theta = Number(theta);
    }

    if (needsTwo) {
      if (!isValidQubit(b)) return showError("Target qubit B is invalid/out of range.");
      if (a === b) return showError("Two-qubit gates must use two different qubits.");
      payload.targets = [a, b];
    }

    if (needsControl) {
      if (!isValidQubit(c)) return showError("Control qubit is invalid/out of range.");
      if (c === a || (needsTwo && c === b))
        return showError("Control qubit must differ from target qubits.");
      payload.control = c;
    }

    setSteps((prev) => [...prev, payload]);
  };

  const reset = () => setSteps([]);

  // --- ASCII circuit preview ---
  const ascii = useMemo(() => {
    // columns correspond to steps
    const rows = Array.from({ length: numQubits }, (_, q) => ({ q, cols: [] }));

    steps.forEach((s) => {
      const col = Array.from({ length: numQubits }, () => "──");
      if (s.targets?.length) {
        s.targets.forEach((t) => {
          col[t] = s.type === "MEASURE" ? "M─" : `${gates[s.type]?.label ?? s.type}`.padEnd(2, " ");
        });
      }
      if (s.control !== undefined) {
        col[s.control] = "● ";
        // draw vertical connector between control and first target
        const top = Math.min(s.control, s.targets[0]);
        const bot = Math.max(s.control, s.targets[0]);
        for (let r = top + 1; r < bot; r++) col[r] = "│ ";
      }
      rows.forEach((r, idx) => r.cols.push(col[idx]));
    });

    const lines = rows.map((r) => `q${r.q} ─ ${r.cols.join("─")}─`);
    return lines.join("\n");
  }, [steps, numQubits, gates]);

  const removeStep = (id) => setSteps((p) => p.filter((s) => s.id !== id));

  return (
    <div className="min-h-screen w-full bg-[#0b0f19] text-white p-6 flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">QOSim Circuit Builder (Debug-Ready)</h1>
        <div className="flex items-center gap-3">
          <label className="text-sm opacity-80">Qubits</label>
          <input
            type="number"
            min={1}
            max={16}
            value={numQubits}
            onChange={(e) => setNumQubits(Math.max(1, Math.min(16, Number(e.target.value) || 1)))}
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 w-20"
          />
          <button onClick={reset} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">Clear</button>
        </div>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-4 bg-white/5 shadow-xl">
          <h2 className="text-lg font-medium mb-3">Add Gate</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 items-end">
            <div className="flex flex-col gap-1">
              <span className="text-xs opacity-80">Gate</span>
              <select
                value={selectedGate}
                onChange={(e) => setSelectedGate(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2"
              >
                {Object.keys(gates).map((k) => (
                  <option key={k} value={k}>{gates[k].label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs opacity-80">Target A</span>
              <input
                type="number"
                value={targetA}
                onChange={(e) => setTargetA(Number(e.target.value))}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs opacity-80">Target B (if 2‑qubit)</span>
              <input
                type="number"
                value={targetB}
                onChange={(e) => setTargetB(Number(e.target.value))}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs opacity-80">Control (if needed)</span>
              <input
                type="number"
                value={control}
                onChange={(e) => setControl(Number(e.target.value))}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2"
              />
            </div>

            {gates[selectedGate]?.params?.includes("theta") && (
              <div className="flex flex-col gap-1">
                <span className="text-xs opacity-80">θ (radians)</span>
                <input
                  type="number"
                  step="0.001"
                  value={theta}
                  onChange={(e) => setTheta(Number(e.target.value))}
                  className="bg-black/40 border border-white/10 rounded-lg px-3 py-2"
                />
              </div>
            )}

            <button
              onClick={addGate}
              className="col-span-2 md:col-span-3 mt-1 px-4 py-2 rounded-xl bg-violet-600/80 hover:bg-violet-500 flex items-center gap-2 justify-center"
            >
              <Play className="w-4 h-4" /> Add Step
            </button>
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-white/5 shadow-xl">
          <h2 className="text-lg font-medium mb-3">Circuit Preview (ASCII)</h2>
          <pre className="bg-black/40 border border-white/10 rounded-xl p-3 text-sm overflow-auto leading-7 whitespace-pre">{ascii}</pre>
        </div>
      </section>

      <section className="rounded-2xl p-4 bg-white/5 shadow-xl">
        <h2 className="text-lg font-medium mb-3">Steps</h2>
        {steps.length === 0 ? (
          <p className="opacity-70 text-sm">No steps yet. Add a gate above.</p>
        ) : (
          <ul className="space-y-2">
            {steps.map((s) => (
              <li key={s.id} className="flex items-center justify-between bg-black/30 rounded-xl px-3 py-2 border border-white/10">
                <div className="text-sm">
                  <span className="font-mono px-2 py-0.5 rounded-lg bg-white/10 mr-2">{s.type}</span>
                  targets: [{s.targets.join(", ")}] {s.control !== undefined && (
                    <span className="ml-2">control: {s.control}</span>
                  )}
                  {s.theta !== undefined && <span className="ml-2">θ={s.theta.toFixed(3)}</span>}
                </div>
                <button
                  onClick={() => removeStep(s.id)}
                  className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="flex items-start gap-3 bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-2xl shadow-2xl max-w-md">
              <AlertTriangle className="w-5 h-5 mt-0.5" />
              <div className="text-sm leading-5">{toast.msg}</div>
              <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100">
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
