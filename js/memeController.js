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
        drawText(meme.lines[0].txt, gElCanvas.width / 2, gElCanvas.height / 8, meme.lines[0].color, meme.lines[0].size)
        defaultLines(meme.lines[0].txt)
      };
}

function onImgSelect(imgIdx) {
    setImg(imgIdx)
    setLineTxt('')
    renderMeme()
}

function drawText(text, x, y, color, size) {
    gCtx.lineWidth = 0;
    gCtx.fillStyle = color; 
    // gCtx.strokeStyle = 'black';
    gCtx.font = `${size}px Impact`;
    console.log('size', size);
    console.log('gCtx.font', gCtx.font);
    gCtx.textAlign = 'center';
    gCtx.textBaseline = 'top';

    gCtx.fillText(text, x, y);
    // gCtx.strokeText(text, x, y);
}

function onSetLineTxt(text) {
    setLineTxt(text)
    renderMeme()
}

function defaultLines(line) {
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


function addEventListener() {
        // window.addEventListener('resize', ()=>{
    //     resizeCanvas()
    //     renderMeme()
    // })
    // resizeCanvas()
}


