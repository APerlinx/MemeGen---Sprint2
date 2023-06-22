'use strict';

let gElCanvas
let gCtx
let gStartPos
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    gElCanvas = document.querySelector('#my-canvas');
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    renderGallery()
    renderMeme()
}

function renderMeme() {
    const meme = getMeme()
    const img = new Image();
    img.src = meme.img;
    img.onload = () => {
        gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width;
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
        const lineHeight = gElCanvas.height / (meme.lines.length + 5);
        meme.lines.forEach((line, index) => {
            const yOffset = (index + 1) * lineHeight;
            drawText(line.txt, gElCanvas.width / 2, yOffset, line.color, line.size, meme.selectedLineIdx, index, line, line.align , line.stroke);
        });
    };
}


function onDeleteLine() {
    deleteLine()
    renderMeme()
}

function onDisplaySavedMemes() {
    const gallerySection = document.querySelector('.gallery');
    gallerySection.style.display = 'none';

    renderSavedMemes()
    const savedMemesSection = document.querySelector('.saved-memes');
    savedMemesSection.style.display = 'block';

}

function onDisplayGallery() {
    const gallerySection = document.querySelector('.gallery');
    gallerySection.style.display = 'grid'

    const savedMemesSection = document.querySelector('.saved-memes');
    savedMemesSection.style.display = 'none'

    renderGallery()
}

function onSaveMeme() {
    const canvas = document.getElementById('my-canvas');
    const canvasData = canvas.toDataURL();
    saveMeme(canvasData);
}

function onImflexible() {
    // TODO: This function is buggy need to fix
    getRndLines()
    onImgSelect(getRandomIntInclusive(0, 18))
    renderMeme()
    openDialog()

}

function onImgSelect(imgIdx) {
    resetEditor()
    const input = document.querySelector('.editor-txt');
    input.value = '';
    setImg(imgIdx)
    renderMeme()
}

function onSavedMemeSelect(index) {
    //TODO: When iamge on meme page, the right image and editor should be opend
}

function onSwitchLine() {
    switchLine()
    renderMeme()
}

function onSwitchLineClick(line) {
    switchLineClick(line)
    if (!line) return
    onDefaultLines(line.txt)
    renderMeme(line)
}

function onAddLine() {
    addLine()
    renderMeme()
}

function drawText(text, x, y, color, size, selectedLineIdx, lineIdx, selectedLine, align , stroke) {
    gCtx.fillStyle = color;
    gCtx.strokeStyle = stroke
    gCtx.font = `${size}px Impact`
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'top'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
    drawRect(x, y, size, text, selectedLine, lineIdx, selectedLineIdx);
}


function drawRect(x, y, size, text, selectedLine, lineIdx, selectedLineIdx) {
    const textWidth = gCtx.measureText(text).width
    const boxPadding = 10
    const boxX = x - textWidth / 2 - boxPadding
    const boxY = y - boxPadding;
    const boxWidth = textWidth + boxPadding * 2
    const boxHeight = size + boxPadding * 2
    const locationX = boxX
    const locationY = boxY
    selectedLine.location = { locationX, locationY };
    if (selectedLineIdx !== lineIdx) return;
    gCtx.beginPath();
    gCtx.rect(boxX, boxY, boxWidth, boxHeight);
    gCtx.strokeStyle = 'white'
    gCtx.stroke();
}

function onSetLineTxt(text) {
    setLineTxt(text)
    renderMeme()
}

function onDefaultLines(lineText) {
    document.querySelector('.editor-txt').value = lineText
}

function onChangeTxtColor(color) {
    changeTxtColor(color)
    renderMeme()
}

function onChangeStrokeColor(stroke) {
    console.log('stroke', stroke);
    const meme = getMeme();
    meme.stroke = stroke;
    renderMeme();
}

function onChangeTxtSize(size) {
    changeTxtSize(size)
    renderMeme()
}

function downloadMeme(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-img'
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}

// Pass gLine as a parameter to the functions that need it
function onDown(ev) {
    const pos = getEvPos(ev);
    const clickedLine = gMeme.lines.find(line => {
        const { location } = line;
        const boxWidth = gCtx.measureText(line.txt).width + 20;
        const boxHeight = line.size + 20;

        return (
            pos.x >= location.locationX &&
            pos.x <= location.locationX + boxWidth &&
            pos.y >= location.locationY &&
            pos.y <= location.locationY + boxHeight
        );
    });

    onSwitchLineClick(clickedLine)

    if (clickedLine) {
        setLineDrag(true);
        gStartPos = pos;
        document.body.style.cursor = 'grabbing';
    }
}

function alignText(align) {
    console.log('align', align);
    const line = gMeme.lines[gMeme.selectedLineIdx];
    const canvas = document.querySelector('#my-canvas');
    const ctx = canvas.getContext('2d');
    switch (align) {
      case 'left':
        line.location.locationX = 0;
        break;
      case 'right':
        line.location.locationX = canvas.width - ctx.measureText(line.txt).width;
        break;
      case 'center':
        line.location.locationX = (canvas.width - ctx.measureText(line.txt).width) / 2;
        break;
      default:
        break;
    }
    renderMeme();
  }
  


function onMove(ev) {
    const pos = getEvPos(ev);

    if (gLine.isDrag) {
        const dx = pos.x - gStartPos.x;
        const dy = pos.y - gStartPos.y;

        moveLine(dx, dy);

        gStartPos = pos;
        renderMeme();
    }
}

function onUp() {
    setLineDrag(false);
    document.body.style.cursor = 'default';
}


function addListeners() {
    addMouseListeners();
    addTouchListeners();
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown);
    gElCanvas.addEventListener('mousemove', onMove);
    gElCanvas.addEventListener('mouseup', onUp);
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown);
    gElCanvas.addEventListener('touchmove', onMove);
    gElCanvas.addEventListener('touchend', onUp);
}


function openDialog() {
  document.querySelector('.dialog').showModal()
}

function closeDialog() {
  document.querySelector('.dialog').close()
}

function onUploadImg() {
    // Gets the image from the canvas
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg') 

    function onSuccess(uploadedImgUrl) {
        // Handle some special characters
        const url = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
    }
    
    // Send the image to the server
    doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {
    // Pack the image for delivery
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    // Send a post req with the image to the server
    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        // If the request is not done, we have no business here yet, so return
        if (XHR.readyState !== XMLHttpRequest.DONE) return
        // if the response is not ok, show an error
        if (XHR.status !== 200) return console.error('Error uploading image')
        const { responseText: url } = XHR
        // Same as
        // const url = XHR.responseText

        // If the response is ok, call the onSuccess callback function, 
        // that will create the link to facebook using the url we got
        console.log('Got back live url:', url)
        onSuccess(url)
    }
    XHR.onerror = (req, ev) => {
        console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
}


  const elDialog = document.querySelector('.dialog')
elDialog.addEventListener('click', ev => {
  const dialogDimensions = elDialog.getBoundingClientRect()
  if (
    ev.clientX < dialogDimensions.left ||
    ev.clientX > dialogDimensions.right ||
    ev.clientY < dialogDimensions.top ||
    ev.clientY > dialogDimensions.bottom
  ) {
    elDialog.close()
  }
})  


