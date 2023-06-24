let gLine 

function getLine() {
  return gLine = getMeme().lines[gMeme.selectedLineIdx]
}

function setLineDrag(isDrag) {
  gLine.isDrag = isDrag;
}

function moveLine(dx, dy) {
  
  gLine.location.locationX += dx;
  gLine.location.locationY += dy;
}

function activateTextEditing(line) {
  const caret = document.createElement('div');
  caret.id = 'my-canvas-caret';
  const canvasRect = gElCanvas.getBoundingClientRect();
  const div = document.createElement('div');
  div.contentEditable = true;
  div.innerText = line.txt;
  div.style.position = 'absolute';
  div.style.left = canvasRect.left + line.location.locationX + 'px';
  div.style.top = canvasRect.top + line.location.locationY + 'px';
  div.style.fontSize = line.size + 'px';
  div.style.color = line.color;
  div.style.fontFamily = 'Impact';
  div.style.textAlign = 'center';
  div.style.opacity = 0;
  div.style.border = 'none';

  div.addEventListener('input', () => {
      line.txt = div.innerText;
      renderMeme();
  });

  div.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
          event.preventDefault();
          div.blur();
          gCtx.canvas.focus(); // Set focus back to the canvas
      } else if (event.key === 'Backspace' && div.innerText.length === 0) {
          event.preventDefault();
          line.txt = '';
          renderMeme();
      }
  });

  div.addEventListener('blur', () => {
      div.parentNode.removeChild(div);
      renderMeme();
  });

  gElCanvas.parentNode.appendChild(div);
  div.focus();
}

function updateLineButtonsPosition() {
  const lineButtons = document.querySelector('.line-buttons');
  const canvasOffset = gElCanvas.getBoundingClientRect();
  const selectedLine = gMeme.lines[gMeme.selectedLineIdx];

  const textWidth = gCtx.measureText(selectedLine.txt).width;
  const buttonsLeft = selectedLine.location.locationX + textWidth + 10;
  const buttonsTop = selectedLine.location.locationY;

  // Adjust the position if it goes beyond the canvas boundaries
  const canvasRight = canvasOffset.left + gElCanvas.width;
  if (buttonsLeft + lineButtons.offsetWidth > canvasRight) {
      buttonsLeft = canvasRight - lineButtons.offsetWidth;
  }
  lineButtons.style.display = 'block';
  lineButtons.style.left = buttonsLeft + 'px';
  lineButtons.style.top = buttonsTop + 'px';
}

function onRotate() {
  isRotating = true;
  console.log('Start')
}

function onEndRotate() {
  isRotating = false;
  console.log('End')
}
