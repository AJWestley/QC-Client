import { getErrors } from "./error_checks.js";
import { executionFailedMessage } from "./validate_code.js";
import { plotCounts } from "./plot_results.js";

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
    console.log('success');
    plotCounts(data.counts);
}

export function execution_failure(data) {
    createMarkers(data);
    executionFailedMessage('Runtime Error');
    console.log(data);
}