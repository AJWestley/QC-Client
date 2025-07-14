import { getErrors } from "./error_checks.js";
import { executionFailedMessage } from "./validate_code.js";
import { createPlots } from "./plot_results.js";

function createMarkers(response) {
    const model = editor.getModel();
    if (!model) return;

    const lines = model.getValue().split('\n');
    const others = [];

    if (response?.line != null && response?.col != null && response?.error) {
        const lineNumber = response.line;
        const column = response.col + 1;

        let startColumn = column;
        let endColumn = column + 1;

        const word = model.getWordAtPosition({ lineNumber, column });
        if (word) {
            startColumn = word.startColumn;
            endColumn = word.endColumn;
        }

        others.push({
            startLineNumber: lineNumber,
            startColumn,
            endLineNumber: lineNumber,
            endColumn,
            message: response.error,
            severity: monaco.MarkerSeverity.Error
        });
    }

    const allErrors = getErrors(lines, others);
    monaco.editor.setModelMarkers(model, 'qasm-linter', allErrors);
}


export function execution_success(data) {
    createPlots(data.counts, data.statevector, data.probabilities);
    const plotSelector = document.getElementById("plot-selector");
    if (plotSelector) {
        plotSelector.disabled = false;
    }
}

export function execution_failure(data) {
    createMarkers(data);
    executionFailedMessage("Execution Failed");
    const plotSelector = document.getElementById("plot-selector");
    if (plotSelector) {
        plotSelector.disabled = true;
    }
}