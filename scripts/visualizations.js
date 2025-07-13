export function drawCircuit() {
    const circuitContainer = document.getElementById("circuit-image");
    const qasmCode = window.editor.getValue();
    var circuit = new QuantumCircuit();
    circuit.importQASM(qasmCode, function(_) {});
    var svg = circuit.exportSVG(true);
    circuitContainer.innerHTML = svg;
}

function inlineComputedStyles(svgEl) {
  if (!svgEl || !svgEl.querySelectorAll) {
    console.error('inlineComputedStyles: Invalid SVG element.');
    return;
  }

  const targets = svgEl.querySelectorAll(`
    text,
    line,
    .qc-gate-box,
    .qc-gate-label,
    .qc-gate-gauge-scale,
    .qc-gate-x,
    .qc-gate-link,
    .qc-gate-link-c,
    .qc-gate-dot,
    .qc-gate-not-line,
    .qc-gate-not
  `);

  const relevantStyles = [
    'fill',
    'stroke',
    'stroke-width',
    'font-size',
    'font-family',
    'r', // for circles/dots
    'opacity'
  ];

  targets.forEach(el => {
    const computed = window.getComputedStyle(el);
    const inline = [];

    for (const prop of relevantStyles) {
      const val = computed.getPropertyValue(prop);
      if (val && val !== 'none' && val !== 'initial') {
        inline.push(`${prop}:${val}`);
      }
    }

    if (inline.length > 0) {
      el.setAttribute('style', inline.join('; '));
    }
  });
}


function saveSVG(filename = 'circuit.svg') {
  const svgEl = document.getElementById("circuit-image").querySelector('svg');
  if (!svgEl) {
    console.error('No SVG found in container.');
    return;
  }

  inlineComputedStyles(svgEl);

  const clone = svgEl.cloneNode(true);

  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

  const svgString = new XMLSerializer().serializeToString(clone);

  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

function savePNG(filename = 'circuit.png', scaleFactor = 10) {
  const svgEl = document.getElementById("circuit-image").querySelector('svg');
  if (!svgEl) {
    console.error('No SVG found in container.');
    return;
  }

  inlineComputedStyles(svgEl);

  const svgString = new XMLSerializer().serializeToString(svgEl);
  const svgBase64 = btoa(unescape(encodeURIComponent(svgString)));

  const img = new Image();
  img.onload = function () {
    const width = img.width * scaleFactor;
    const height = img.height * scaleFactor;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    }, 'image/png');
  };

  img.onerror = function (err) {
    console.error("Failed to load image from SVG", err);
  };

  img.src = 'data:image/svg+xml;base64,' + svgBase64;
}


document.getElementById('exportSVGBtn').addEventListener('click', function() {
  saveSVG('circuit.svg');
});

document.getElementById('exportPNGBtn').addEventListener('click', function() {
  savePNG('circuit.png');
});