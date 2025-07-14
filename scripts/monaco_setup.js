import { api } from './connect.js';
import { isValidSyntax } from './validate_code.js';
import { execution_success, execution_failure } from './handle_response.js';
import { SKELETON } from './example_programs.js';

const filenameDisplay = document.getElementById("editor-filename");
const saveBtn = document.getElementById("saveBtn");
let fileHandle = null;

  // ----- Run Button -----
document.getElementById("playBtn").onclick = async () => {
  try {
    const code = window.editor.getValue();
    if (!isValidSyntax(code)) {
      return;
    }

    let shots = document.getElementById("shot-selector")?.value;
    if (!shots || isNaN(shots) || shots < 1 || shots > 10000) {
      shots = 1024;
    }

    const backend = document.getElementById("backend-selector")?.value || 'fault-tolerant';

    const [ result, status ] = await api.execute(code, shots, backend);
    if (status === 200) {
      execution_success(result);
    }
    else {
      execution_failure(result);
    }
  } catch (err) {
    console.warn("Load cancelled:", err);
  }
};

  // ----- Clear Button -----
document.getElementById("clearBtn").onclick = async () => {
  window.editor.setValue(SKELETON);
};

// ----- Load Button -----
document.getElementById("loadBtn").onclick = async () => {
  try {
    [fileHandle] = await window.showOpenFilePicker({
      types: [{ description: "QASM or Text Files", accept: { "text/plain": [".qasm", ".txt"] } }],
    });

    const file = await fileHandle.getFile();
    const contents = await file.text();
    editor.setValue(contents);
    filenameDisplay.textContent = file.name;
    saveBtn.disabled = false;
  } catch (err) {
    console.warn("Load cancelled:", err);
  }
};

// ----- Save As Button -----
document.getElementById("saveAsBtn").onclick = async () => {
  try {
    fileHandle = await window.showSaveFilePicker({
      suggestedName: "untitled.qasm",
      types: [{ description: "QASM File", accept: { "text/plain": [".qasm", ".txt"] } }],
    });

    const writable = await fileHandle.createWritable();
    await writable.write(editor.getValue());
    await writable.close();

    filenameDisplay.textContent = (await fileHandle.getFile()).name;
    saveBtn.disabled = false;
  } catch (err) {
    console.warn("Save As cancelled:", err);
  }
};

// ----- Save Button -----
saveBtn.onclick = async () => {
  if (!fileHandle) return;
  try {
    const writable = await fileHandle.createWritable();
    await writable.write(editor.getValue());
    await writable.close();
  } catch (err) {
    console.error("Save failed:", err);
  }
};

// ----- Ctrl+S Shortcut -----
window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
    e.preventDefault();
    if (!saveBtn.disabled) {
      saveBtn.click();
    }
  }
});

// ----- Shot Selector -----
document.getElementById("shot-selector").addEventListener("input", (e) => {
  const shots = e.target.value;
  if (shots && (shots < 1 || shots > 10000)) {
    e.target.value = Math.max(1, Math.min(10000, shots));
  } 
});