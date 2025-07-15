# QASM Editor

**Live Site:** [ajwestley.github.io/QC-Client](https://ajwestley.github.io/QC-Client/)  
**Backend:** Raspberry Pi running Qiskit via Flask API

The QASM Editor is a browser-based interface for writing, visualizing, and executing OpenQASM code. It features a Monaco-based code editor, interactive circuit diagram generation, simulation via a Flask API using Qiskit, and result plotting with Chart.js.

#### NB: If Server Offline
If the website is not connecting to the server, it is likely that my Raspberry Pi is not plugged in. Email me at alexanderjwestley@gmail.com to ask me to plug it in.

---

## Features

- 🧠 **Monaco Editor** with syntax highlighting for QASM
- ⚛️ **Quantum Circuit Visualization** from OpenQASM code
- 🧪 **Simulation** of quantum circuits using Qiskit (via Flask on a Raspberry Pi)
- 📈 **Result Plotting**:
  - Measurement Counts
  - State Vector Visualization
  - Probability Distribution
- 📦 **Export Options**:
  - Circuit as PNG/SVG
  - Raw Results and Plots
- 💡 **Built-in Quantum Algorithms** (click to insert examples):
  - Coin Flip
  - Bell State
  - GHZ State
  - Deutsch's Algorithm
  - Grover's Algorithm
  - 2/4-Bit QFT and IQFT
  - Quantum Phase Estimation
  - Quantum Teleportation
  - Superdense Coding
  - Error Correction
- ⚙️ **Execution Settings**:
  - Select backend mode (Noisy / Fault-Tolerant)
  - Adjust number of shots
- 🌓 **Theme Toggle** (Dark/Light Mode)

---

## Architecture Overview

```

\[Frontend: GitHub Pages]
|
\| - OpenQASM editor (Monaco)
\| - Circuit visualization
\| - Result plots (Chart.js)
|
V
\[Backend: Raspberry Pi Flask Server]
|
\| - Receives QASM code via REST API
\| - Uses Qiskit to transpile and simulate
\| - Sends results (counts, state vector, etc.) back to client

````

---

## Getting Started (for Development)

> This assumes you're running your own backend and want to test locally.

### Prerequisites

- Node.js (for serving frontend, if needed)
- Python 3 + Flask (on backend)
- Qiskit installed on your Flask backend

### Clone the Repository

```bash
git clone https://github.com/ajwestley/QC-Client.git
cd QC-Client
````

### Start the Frontend

You can open `index.html` directly, or serve it with a simple HTTP server:

```bash
npx serve .
```

### Start the Backend (on Raspberry Pi)

Create and run a Flask server that exposes a POST endpoint to receive QASM code, simulate with Qiskit, and return results.

---

## License & Attribution

This project uses the following third-party libraries:

* [**Monaco Editor**](https://github.com/microsoft/monaco-editor)
  License: [MIT License](https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt)

* [**Chart.js**](https://github.com/chartjs/Chart.js)
  License: [MIT License](https://github.com/chartjs/Chart.js/blob/master/LICENSE.md)

* [**quantum-circuit**](https://github.com/quantastica/quantum-circuit)
  License: [MIT License](https://github.com/quantastica/quantum-circuit/blob/master/LICENSE.txt)

---

## Author

**AJ Westley**
Computer Scientist & Quantum Computing Enthusiast
🔗 [ajwestley.com](ajwestley.com)

---


## Disclaimer

This is an educational and experimental project. The backend execution is handled on a personal Raspberry Pi using Qiskit. Not intended for production workloads or large-scale simulation. 


