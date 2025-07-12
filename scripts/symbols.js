export const keywords = ['include', 'qreg', 'creg', 'if', 'measure', 'reset', 'barrier', 'gate', 'opaque', 'OPENQASM']

export const built_ins = ['pi', 'sin', 'cos', 'tan', 'exp', 'ln', 'sqrt', 'asin', 'acos', 'atan', 'ceil', 'floor']

export const gates = [
    // Single-Qubit Gates
    'h', 'x', 'y', 'z', 'id', 't', 's', 'tdg', 'sdg', 'sx', 'sxdg', // Simple
    'p', 'rz', 'rx', 'ry', // Rotational

    // Multi-Qubit Gates
    'rccx', 'rc3x', 'swap', 'ccx', // Simple
    'rxx', 'rzz', // Rotational

    // Conditional Gates
    'cx', 'cy', 'cz', 'ch', 'csx', // Simple
    'cp', 'crz', 'crx', 'cry', 'cu', // Rotational
    'ccx', 'c3x', 'c4x', 'cswap', // Other

    // U Gates
    'u', 'u1', 'u2', 'u3'
]