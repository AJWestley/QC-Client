export function drawCircuit() {
    const circuitContainer = document.getElementById("top-panel");
    const qasmCode = window.editor.getValue();
    var circuit = new QuantumCircuit();
    circuit.importQASM(qasmCode, function(errors) {
        console.log(errors);
    });
    var svg = circuit.exportSVG(true);
    circuitContainer.innerHTML = svg;
}