export const DEFAULT_TEXT = `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

// Flip a coin
h q[0];
measure q[0] -> c[0];
`;

export const SKELETON = `OPENQASM 2.0;
include "qelib1.inc";

qreg q[1];
creg c[1];

measure q[0] -> c[0];`