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
