'use strict';

let gElCanvas;
let gCtx;

function onInit() {
    gElCanvas = document.querySelector('#my-canvas');
    gCtx = gElCanvas.getContext('2d')
    addEventListener()
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
            drawText(line.txt, gElCanvas.width / 2, yOffset, line.color, line.size, meme.selectedLineIdx, index, line);

        });
    };
}

function onDisplaySavedMemes() {
    const gallerySection = document.querySelector('.gallery');
    gallerySection.style.display = 'none';

    renderSavedMemes()
    const savedMemesSection = document.querySelector('.saved-memes');
    savedMemesSection.style.display = 'block';

}

function onSaveMeme() {
    const canvas = document.getElementById('my-canvas');
    const canvasData = canvas.toDataURL();
    saveMeme(canvasData);
}

function onImflexible() {
    // TODO: This function is buggy need to fix
    getRndMeme()
    onImgSelect(4)
    renderMeme()
    openDialog()

}
function onImgSelect(imgIdx) {
    setImg(imgIdx)
    setLineTxt('')
    renderMeme()
}

function onSavedMemeSelect(index) {
 //TODO: When iamge on meme page, the right image and editor should be opend
}

function onSwitchLine() {
    SwitchLine()
    renderMeme()
}

function onSwitchLineClick(line) {
    switchLineClick(line)
    renderMeme()
}

function onAddLine() {
    addLine()
    renderMeme()
}

function drawText(text, x, y, color, size, selectedLineIdx, lineIdx, selectedLine) {
    gCtx.fillStyle = color;
    gCtx.font = `${size}px Impact`;
    gCtx.textAlign = 'center';
    gCtx.textBaseline = 'top';
    gCtx.fillText(text, x, y);
    drawRect(x, y, size, text, selectedLine, lineIdx, selectedLineIdx);
    onDefaultLines(selectedLine.txt);
}


function drawRect(x, y, size, text, selectedLine, lineIdx, selectedLineIdx) {

    const textWidth = gCtx.measureText(text).width
    const boxPadding = 10

    // Calculate the coordinates for the box
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

function onDefaultLines(line) {
    document.querySelector('.editor-txt').value = line
}

function onChangeTxtColor(color) {
    changeTxtColor(color)
    renderMeme()
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
    return pos
}

function onDown(ev) {
    const pos = getEvPos(ev);
    const meme = getMeme();

    const line = meme.lines.find(line => {
        const { locationX, locationY } = line.location;
        const boxWidth = gCtx.measureText(line.txt).width + 20;
        const boxHeight = line.size + 20;

        return (
            pos.x >= locationX &&
            pos.x <= locationX + boxWidth &&
            pos.y >= locationY &&
            pos.y <= locationY + boxHeight
        );
    });

    onSwitchLineClick(line)
}



function addEventListener() {
    gElCanvas.addEventListener('mousedown', onDown)
}


