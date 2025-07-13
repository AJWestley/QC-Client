import { keywords, gates, built_ins } from "./symbols.js";

require.config({ paths: { vs: './monaco-editor/min/vs' } });

const brackets = ['[', '{', '('];
const bracketMap = {'[':']','{':'}', '(':')'};

export function getErrors(lines, others = []) {
    const knownWords = new Set([...keywords, ...gates, ...built_ins]);
    return [
      ...others,
      ...checkUnclosedBrackets(lines),
      // ...checkUnknownIdentifiers(lines, knownWords), TODO: re-enable once register vars aren't flagged
      ...checkNoMeasure(lines),
      ...checkNoCReg(lines),
      ...checkNoQReg(lines),
      ...checkEmptyBrackets(lines),
      ...checkBracketContent(lines),
      ...checkSemicolons(lines)
    ];
}

function checkSemicolons(lines) {
    const markers = [];
  
  lines.forEach((line, i) => {
    const code = line.split('//')[0];
    const trimmed = code.trim();

    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) {
      return;
    }

    if (!trimmed.includes(';')) {
        markers.push({
            startLineNumber: i + 1,
            startColumn: code.length,
            endLineNumber: i + 1,
            endColumn: code.length + 1,
            message: "Syntax Error: missing semicolon ';'.",
            severity: monaco.MarkerSeverity.Error
        });
        return;
    }

    const [_, end] = getMatchPos(code, /^[^a-zA-Z_]*;/);
    if (end !== -1) {
        markers.push({
            startLineNumber: i + 1,
            startColumn: end,
            endLineNumber: i + 1,
            endColumn: end + 1,
            message: "Syntax Error: unexpected semicolon ';'.",
            severity: monaco.MarkerSeverity.Error
        });
    }
    
  });
  return markers;
}

function checkBracketContent(lines) {
  const markers = [];
  
  lines.forEach((line, i) => {
    const code = line.split('//')[0];

    const [start, end] = getMatchPos(code, /\[(^\])*\D+(^\])*\]/);
    if (start !== -1) {
        markers.push({
            startLineNumber: i + 1,
            startColumn: start + 2,
            endLineNumber: i + 1,
            endColumn: end,
            message: `Syntax Error: invalid bracket contents '${code.substring(start+1, end-1)}'.`,
            severity: monaco.MarkerSeverity.Error
        });
    }
  });
  return markers;
}

function checkEmptyBrackets(lines) {
  const markers = [];
  
  lines.forEach((line, i) => {
    const code = line.split('//')[0];

    const [start, end] = getMatchPos(code, /\[\s*\]/);

    if (start !== -1) {
        markers.push({
            startLineNumber: i + 1,
            startColumn: start + 1,
            endLineNumber: i + 1,
            endColumn: end + 1,
            message: "Syntax Error: square brackets ('[]') must contain an integer value.",
            severity: monaco.MarkerSeverity.Error
        });
    }
  });
  return markers;
}

function checkNoQReg(lines) {
  const markers = [];
  let foundQReg = false;
  let violated = false;
  let idx= 0;
  
  lines.forEach((line, i) => {
    const code = line.split('//')[0];

    if ((!code || code.startsWith('//') || code.startsWith('#') )|| foundQReg || violated) {
      return;
    }

    const isPreamble = /^(OPENQASM|include|creg)\s+.+?\s*$/.test(code);

    if (isPreamble) {
      return;
    }

    const isQReg = /^qreg\s+.+?\s*$/.test(code);

    if (isQReg) {
      foundQReg = true;
    }
    else {
        violated = true;
        idx = i + 1;
    }

  });

  if (violated) {
    markers.push({
      startLineNumber: idx,
      startColumn: 0,
      endLineNumber: idx,
      endColumn: 1,
      message: 'Register Error: No quantum register (qreg) declared.',
      severity: monaco.MarkerSeverity.Error
    });
  }

  return markers;
}

function checkNoCReg(lines) {
  const markers = [];
  let foundCReg = false;
  let foundMeasure = false;
  let idx= 0;
  
  lines.forEach((line, i) => {
    const code = line.split('//')[0];

    if ((!foundCReg && foundMeasure) || foundCReg) {
      return;
    }

    const isMeasure = /^measure\s+.+?\s*$/.test(code);

    if (isMeasure) {
      foundMeasure = true;
      idx = i + 1;
      return;
    }

    const isCReg = /^creg\s+.+?\s*$/.test(code);

    if (isCReg) {
      foundCReg = true;
    }

  });

  if (!foundCReg || foundMeasure) {
    markers.push({
      startLineNumber: idx,
      startColumn: 0,
      endLineNumber: idx,
      endColumn: 1,
      message: 'Register Error: No classical register (creg) declared.',
      severity: monaco.MarkerSeverity.Error
    });
  }

  return markers;
}

function checkNoMeasure(lines) {
  const markers = [];
  let foundMeasureBlock = false;
  let endIdx= 0;
  let endLength = 0;
  
  lines.forEach((line, i) => {
    const code = line.split('//')[0];

    if (foundMeasureBlock) {
      return;
    }

    const isMeasure = /^measure\s+.+?\s*$/.test(code);

    if (isMeasure) {
      foundMeasureBlock = true;
    }
    endIdx = i + 1;
    endLength = line.length + 1;
  });

  if (!foundMeasureBlock) {
    markers.push({
      startLineNumber: endIdx,
      startColumn: 0,
      endLineNumber: endIdx,
      endColumn: endLength,
      message: 'Measurement Error: No measurement statement provided.',
      severity: monaco.MarkerSeverity.Error
    });
  }

  return markers;
}

function checkUnclosedBrackets(lines) {
  const markers = [];
  
  lines.forEach((line, i) => {
    const code = line.split('//')[0];
    brackets.forEach((b, _) => {
      const rxIndex = code.indexOf(b);
      if (rxIndex !== -1 && !code.includes(bracketMap[b])) {
        markers.push({
          startLineNumber: i + 1,
          startColumn: rxIndex + 1,
          endLineNumber: i + 1,
          endColumn: line.length + 1,
          message: `Syntax Error: Missing closing '${bracketMap[b]}'.`,
          severity: monaco.MarkerSeverity.Error
        });
      }
    });
  });
  return markers;
}

function checkUnknownIdentifiers(lines, knownWords) {
  const markers = [];
  lines.forEach((line, i) => {
    const code = line.split('//')[0];
    const tokens = code.split(/[\s;]+/);
    tokens.forEach(token => {
      if (/^[a-zA-Z_]\w*$/.test(token) && !knownWords.has(token)) {
        const col = line.indexOf(token);
        markers.push({
          startLineNumber: i + 1,
          startColumn: col + 1,
          endLineNumber: i + 1,
          endColumn: col + token.length + 1,
          message: `Syntax Error: '${token}' is not recognized as a gate, keyword, or built-in`,
          severity: monaco.MarkerSeverity.Warning
        });
      }
    });
  });
  return markers;
}

function getMatchPos(text, regex) {
    let match = regex.exec(text);
    let start = -1, end = -1;
    if (match) {
        start = match.index;
        end = start + match[0].length;
    }
    return [ start, end ]
}
