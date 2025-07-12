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
