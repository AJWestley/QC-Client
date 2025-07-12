const resizer = document.getElementById('resizer');
const leftPanel = document.getElementById('left-panel');
const rightPanel = document.getElementById('right-panel');

resizer.addEventListener('mousedown', function (e) {
  e.preventDefault();

  document.addEventListener('mousemove', resize);
  document.addEventListener('mouseup', stopResize);
});

function resize(e) {
  const containerOffsetLeft = document.getElementById('resizable-container').offsetLeft;
  const pointerRelativeXpos = e.clientX - containerOffsetLeft;
  const minWidth = 150;
  const maxWidth = document.getElementById('resizable-container').offsetWidth - minWidth;

  if (pointerRelativeXpos > minWidth && pointerRelativeXpos < maxWidth) {
    leftPanel.style.width = `${pointerRelativeXpos}px`;
  }
}

function stopResize() {
  document.removeEventListener('mousemove', resize);
  document.removeEventListener('mouseup', stopResize);
}

const up_down_resizer = document.getElementById('up-down-resizer');
const topPanel = document.getElementById('top-panel');
const bottomPanel = document.getElementById('bottom-panel');
const circuitContainer = document.getElementById('circuit-image');

let isDragging = false;

up_down_resizer.addEventListener('mousedown', (e) => {
  isDragging = true;
  document.body.style.cursor = 'row-resize';
  document.body.style.userSelect = 'none';
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const containerOffsetTop = document.getElementById('left-panel').offsetTop;
  const newTopHeight = e.clientY - containerOffsetTop;

  // Set min/max bounds if needed
  const minHeight = 100;
  const maxHeight = document.getElementById('left-panel').clientHeight - 100;

  if (newTopHeight >= minHeight && newTopHeight <= maxHeight) {
    topPanel.style.height = `${newTopHeight}px`;
    topPanel.style.maxHeight = `${newTopHeight}px`;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
});