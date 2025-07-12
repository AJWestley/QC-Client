import { getErrors } from "./error_checks.js";
import { DEFAULT_TEXT } from "./example_programs.js";
import { keywords, gates, built_ins } from "./symbols.js";

require.config({ paths: { vs: './monaco-editor/min/vs' } });

function wordsToRegex(words) {
  return new RegExp(`\\b(?:${words.join('|')})\\b`);
}

require(['vs/editor/editor.main'], function () {
  // ----- Register QASM Language -----
  monaco.languages.register({ id: 'qasm' });

  // ----- Tokenizer (Monarch) -----
  monaco.languages.setMonarchTokensProvider('qasm', {
    defaultToken: '',

    tokenizer: {
      root: [
        // Comments
        [/\/\/.*/, 'comment'],
        [/OPENQASM 2.0;/, 'comment'],

        // Keywords
        [wordsToRegex(keywords), 'keyword'],

        // Gates
        [wordsToRegex(gates), 'gate'],

        // Built-In Methods and Constants
        [wordsToRegex(built_ins), 'builtin'],

        // Identifiers
        [/[a-zA-Z_][\w]*/, 'identifier'],

        // Numbers
        [/\d+\.\d+/, 'number.float'],
        [/\d+/, 'number'],

        // Operators
        [/==|!=|<=|>=|\|\||&&|[+\-*/%<>=!]/, 'operator'],

        // Strings
        [/\".*?\"/, 'string'],

        // Brackets
        [/\[|\]|\{|\}|\(|\)/, 'bracket'],
      ]
    }
  });

  const isLight = !document.getElementById('theme-light').disabled;
  let theme = isLight ? 'vs-light' : 'vs-dark';

  // ----- Define Custom Theme -----
  monaco.editor.defineTheme('qasm-theme', {
    base: theme,
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '61AFEF' },
      { token: 'gate', foreground: 'C678DD' },
      { token: 'builtin', foreground: 'E5C07B' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'operator', foreground: '56B6C2' },
      { token: 'string', foreground: '98C379' },
      { token: 'comment', foreground: '7F848E' },
      { token: 'identifier', foreground: 'E06C75' },
      { token: 'bracket', foreground: 'D19A66' }
    ],
    colors: {}
  });

  // ----- Create Editor -----
  window.editor = monaco.editor.create(document.getElementById('editor'), {
    value: DEFAULT_TEXT,
    language: 'qasm',
    theme: 'qasm-theme',
    automaticLayout: true
  });

  const model = editor.getModel();

  function runLinter() {
    const lines = model.getValue().split('\n');
    monaco.editor.setModelMarkers(model, 'qasm-linter', getErrors(lines));
  }

  editor.onDidChangeModelContent(() => {runLinter()});
  runLinter();
});

