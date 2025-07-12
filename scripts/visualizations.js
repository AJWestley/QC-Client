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


function savePNG(filename = 'circuit.png', scale = 10) {
  const svgEl = document.getElementById("circuit-image").querySelector('svg');
  if (!svgEl) {
    console.error('No SVG found in container.');
    return;
  }

  inlineComputedStyles(svgEl);

  // Clone to avoid modifying DOM
  const clone = svgEl.cloneNode(true);

  // Add required namespaces
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

  // Serialize to string
  const svgString = new XMLSerializer().serializeToString(clone);
  const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);

  // Create an image from the SVG
  const img = new Image();
  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = scale * img.width;
    canvas.height = scale * img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Convert canvas to PNG blob
    canvas.toBlob(function (blob) {
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();

      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  img.onerror = function (e) {
    console.error('Failed to load SVG into image:', e);
  };

  img.src = svgDataUrl;
}


document.getElementById('saveImageBtn').addEventListener('click', function() {
  savePNG('circuit.png');
});