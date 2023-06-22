let gLine = gMeme.lines[0]

function getLine() {
  return gLine
}

//Check if the click is inside the Line 
function isLineClicked(clickedPos) {
  const { location } = gLine
  // Calc the distance between two dots
  const distance = Math.sqrt((location.locationX - clickedPos.x) ** 2 + (location.locationY - clickedPos.y) ** 2)
  // console.log('distance', distance)
  //If its smaller then the radius of the Line we are inside
  return distance <= gLine.size
}


function setLineDrag(isDrag) {
  gLine.isDrag = isDrag;
}


function moveLine(dx, dy) {
  gLine.location.locationX += dx;
  gLine.location.locationY += dy;
}