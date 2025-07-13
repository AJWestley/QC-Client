export const DEFAULT_TEXT = `OPENQASM 2.0;
include "qelib1.inc";

qreg q[1];
creg c[1];

// Flip a coin
h q[0];
measure q[0] -> c[0];
`;

export const SKELETON = `OPENQASM 2.0;
include "qelib1.inc";

qreg q[1];
creg c[1];

measure q[0] -> c[0];`

const QFT_2BIT = `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

// Apply QFT
h q[0];
cu1(pi/2) q[1], q[0];
h q[1];

// Swap qubits
swap q[0], q[1];

// Measure
measure q -> c;
`;

const IQFT_2BIT = `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

// Swap qubits
swap q[0], q[1];

// Apply Inverse QFT
h q[1];
cu1(-pi/2) q[1], q[0];
h q[0];

// Measure
measure q -> c;
`;

const QFT_4BIT = `OPENQASM 2.0;
include "qelib1.inc";

qreg q[4];
creg c[4];

// Apply QFT
h q[0];
cu1(pi/2) q[1], q[0];
cu1(pi/4) q[2], q[0];
cu1(pi/8) q[3], q[0];

h q[1];
cu1(pi/2) q[2], q[1];
cu1(pi/4) q[3], q[1];

h q[2];
cu1(pi/2) q[3], q[2];

h q[3];

// Swap qubits
swap q[0], q[3];
swap q[1], q[2];

// Measure
measure q -> c;
`;

const IQFT_4BIT = `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

// Swap qubits
swap q[0], q[3];
swap q[1], q[2];

// Apply Inverse QFT 
h q[0];
cu1(-pi/2) q[1], q[0];
cu1(-pi/4) q[2], q[0];
cu1(-pi/8) q[3], q[0];

h q[1];
cu1(-pi/2) q[2], q[1];
cu1(-pi/4) q[3], q[1];

h q[2];
cu1(-pi/2) q[3], q[2];

h q[3];

// Measure
measure q -> c;
`;

const BELL_STATE = `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

h q[0];
cx q[0], q[1];

measure q -> c;
`;

const DEUTSCH = `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

x q[1];
h q[0];
h q[1];
cx q[0], q[1];
h q[0];

measure q[0] -> c[0];
`;

const GHZ = `OPENQASM 2.0;
include "qelib1.inc";

qreg q[3];
creg c[3];

h q[0];
cx q[0], q[1];
cx q[0], q[2];

measure q -> c;
`;

const SUPERDENSE = `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

// Create entangled pair
h q[0];
cx q[0], q[1];

// Alice encodes '11'
x q[0];
z q[0];

barrier q;

// Bob decodes
cx q[0], q[1];
h q[0];

measure q -> c;
`

const GROVER_3BIT = `OPENQASM 2.0;
include "qelib1.inc";

qreg q[3];
creg c[3];

// 3 Bit Grover's Algorithm (any more bits is a bit long)

// Step 1: Initialize to uniform superposition
h q[0];
h q[1];
h q[2];

// --- ORACLE START (Marks |010⟩) ---
x q[0];
x q[2];
h q[2];
ccx q[0], q[1], q[2];
h q[2];
x q[0];
x q[2];
// --- ORACLE END ---

// --- ALTERNATIVE ORACLES (replace above section with one of these) ---

// Mark |000⟩
// x q[0]; x q[1]; x q[2];
// h q[2]; ccx q[0], q[1], q[2]; h q[2];
// x q[0]; x q[1]; x q[2];

// Mark |001⟩
// x q[1]; x q[2];
// h q[2]; ccx q[0], q[1], q[2]; h q[2];
// x q[1]; x q[2];

// Mark |100⟩
// x q[0]; x q[1];
// h q[2]; ccx q[0], q[1], q[2]; h q[2];
// x q[0]; x q[1];

// Mark |110⟩
// x q[0];
// h q[2]; ccx q[0], q[1], q[2]; h q[2];
// x q[0];

// --- DIFFUSION OPERATOR START ---
h q[0];
h q[1];
h q[2];

x q[0];
x q[1];
x q[2];

h q[2];
ccx q[0], q[1], q[2];
h q[2];

x q[0];
x q[1];
x q[2];

h q[0];
h q[1];
h q[2];
// --- DIFFUSION OPERATOR END ---

measure q -> c;
`

const TELEPORTATION = `OPENQASM 2.0;
include "qelib1.inc";

qreg q[3];
creg c1[1];
creg c2[1];
creg c3[1];

// Step 0: Prepare unknown state on q[0]
// Example: |+> state
h q[0];

// Step 1: Prepare entangled pair on q[1] and q[2]
h q[1];
cx q[1], q[2];

// Step 2: Bell measurement on q[0] and q[1]
cx q[0], q[1];
h q[0];
measure q[0] -> c1[0];
measure q[1] -> c2[0];

// Step 3: Conditional operations on q[2]
if (c1 == 1) x q[2];
if (c2 == 1) z q[2];

// Now q[2] holds the original unknown state`

const QPE_3BIT = `OPENQASM 2.0;
include "qelib1.inc";

qreg q[3];  // q[0], q[1] control qubits; q[2] target eigenstate
creg c[2];  // measure q[0], q[1]

// Prepare eigenstate of U = Rz(pi/2) on q[2]
h q[2];  // |+> is eigenstate of Z with eigenvalue +1

// Initialize control qubits to |0> and put in superposition
h q[0];
h q[1];

// Controlled-U operations with powers of 2:
rz(pi/2) q[2];        // U^{2^0}
crz(pi/4) q[1], q[2]; // U^{2^1}

// Inverse QFT on control qubits q[0], q[1]

// Swap q[0] and q[1]
swap q[0], q[1];

// Apply inverse QFT:
h q[0];
cu1(-pi/2) q[1], q[0];
h q[1];

// Measure control qubits
measure q[0] -> c[0];
measure q[1] -> c[1];
`

const ERROR_CORRECTION = `OPENQASM 2.0;
include "qelib1.inc";

qreg data[3];   // logical qubit encoded across data[0..2]
qreg ancilla[2]; // syndrome measurement
creg c[3];       // measurement results

// Encode logical |0> or |1> (example |+> state encoded)
h data[0];
cx data[0], data[1];
cx data[0], data[2];

// --- Introduce bit-flip error on data qubit 1 (simulate noise) ---
// x data[1];  // Uncomment to simulate error

// Syndrome measurement
cx data[0], ancilla[0];
cx data[1], ancilla[0];

cx data[1], ancilla[1];
cx data[2], ancilla[1];

measure ancilla[0] -> c[0];
measure ancilla[1] -> c[1];

// Conditional correction based on syndrome (pseudo-code, classical post-processing required)
// if c == 01: x data[0]
// if c == 10: x data[2]
// if c == 11: x data[1]

// Decode logical qubit (optional)
cx data[0], data[1];
cx data[0], data[2];
h data[0];

// Measure logical qubit
measure data[0] -> c[2];
`


const examplePrograms = {
    "Coin Flip": DEFAULT_TEXT,
    "Bell State": BELL_STATE,
    "GHZ State": GHZ,
    "Deutsch's Algorithm": DEUTSCH,
    "Grover's Algorithm": GROVER_3BIT,
    "2-Bit QFT": QFT_2BIT,
    "4-Bit QFT": QFT_4BIT,
    "2-Bit IQFT": IQFT_2BIT,
    "4-Bit IQFT": IQFT_4BIT,
    "Quantum Phase Estimation": QPE_3BIT,
    "Quantum Teleportation": TELEPORTATION,
    "Superdense Coding": SUPERDENSE,
    "Error Correction": ERROR_CORRECTION,
}


const dropdownContent = document.querySelector('#algoDropdown .dropdown-content');

if (dropdownContent) {
  Object.entries(examplePrograms).forEach(([name, programText]) => {
    const item = document.createElement('button');
    item.textContent = name;
    item.className = 'dropdown-item';
    item.addEventListener('click', () => {
      if (window.editor) {
        window.editor.setValue(programText);
      }
    });
    dropdownContent.appendChild(item);
  });
}