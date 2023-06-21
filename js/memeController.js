'use strict';

let gElCanvas;
let gCtx;

function onInit() {
    gElCanvas = document.querySelector('#my-canvas');
    gCtx = gElCanvas.getContext('2d');
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
        drawText(meme.lines[0].txt, gElCanvas.width / 2, gElCanvas.height / 8);
        defaultLines(meme.lines[0].txt)
      };
}

function onImgSelect(imgIdx) {
    setImg(imgIdx)
    setLineTxt('')
    renderMeme()
}

function drawText(text, x, y) {
    gCtx.lineWidth = 0;
    gCtx.fillStyle = 'red'; 
    gCtx.strokeStyle = 'black';
    gCtx.font = '20px Arial';
    gCtx.textAlign = 'center';
    gCtx.textBaseline = 'middle';

    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
}

function onSetLineTxt(text) {
    setLineTxt(text)
    renderMeme()
}

function defaultLines(line) {
    document.querySelector('.editor-txt').value = line
}

function addEventListener() {
        // window.addEventListener('resize', ()=>{
    //     resizeCanvas()
    //     renderMeme()
    // })
    // resizeCanvas()
}
