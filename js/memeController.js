'use strict';

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']
let gElCanvas
let gCtx
let gStartPos
let isResizing = false
let isRotating = false
let rotationAngle = 0
let isLineClicked = false
let gIsAnyLineClicked = 0
let gSelectedEmoji = null

function onInit() {
    gElCanvas = document.querySelector('#my-canvas');
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    renderGallery()
    renderKeyWordSeach()
    renderEmojisSection()
    updateLineButtonsPosition()
}

function renderMeme() {
    const meme = getMeme();
    const img = new Image();
    img.src = meme.img;
    img.onload = () => {
        gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width;
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
        for (let index = 0; index < meme.lines.length; index++) {
            let line = meme.lines[index];
            let xOffset = 0
            let lineYOffset = 0;
            xOffset = line.location.locationX
            lineYOffset = line.location.locationY
            drawText(
                line.txt,
                xOffset,
                lineYOffset,
                line.color,
                line.size,
                meme.selectedLineIdx,
                index,
                line.align,
                line.stroke
            )
        }
        gEmojis.map(emoji => {
            const { x, y, emoji: emojiText, width } = emoji;
            drawEmoji({ x, y, emoji: emojiText, width })
        });
    }
}

function drawEmoji({ x, y, emoji: emojiText, width}) {
    gCtx.save();
    gCtx.textAlign = 'center';
    gCtx.translate(x, y);
    gCtx.font = `${width}px Impact`;
    gCtx.fillText(emojiText, 0, 0);
    gCtx.restore();
}

function renderKeyWordSeach() {
    const keywordContainer = document.querySelector('.searchBy')
    const keyWordMap = createKeyWordMap()
    for (const key in keyWordMap) {
        const button = document.createElement('button')
        button.classList.add('keyword');
        button.innerText = key;
        button.addEventListener('click', () => onKeyWordSearch(key))
        keywordContainer.appendChild(button)
        const fontSize = keyWordMap[key] / 6 + 'em'
        button.style.fontSize = fontSize;
    }
}

function onKeyWordSearch(keyword) {
    document.querySelector('.data-input').value = keyword
    renderGallery()
}

function onDeleteLine() {
    deleteLine()
    renderMeme()
    updateLineButtonsPosition()
}

function onDisplaySavedMemes() {
    const gallerySection = document.querySelector('.gallery')
    gallerySection.style.display = 'none'
    renderSavedMemes()
    const savedMemesSection = document.querySelector('.saved-memes')
    savedMemesSection.style.display = 'block'
}

function onDisplayGallery() {
    const gallerySection = document.querySelector('.gallery')
    gallerySection.style.display = 'grid'
    const savedMemesSection = document.querySelector('.saved-memes')
    savedMemesSection.style.display = 'none'
    renderGallery()
}

function onSaveMeme() {
    const canvas = document.getElementById('my-canvas')
    const canvasData = canvas.toDataURL()
    saveMeme(canvasData)
}

function onImflexible() {
    
    onImgSelect(getRandomIntInclusive(0, 18))
    getRndLines()
    renderMeme()
    openDialog()
}

function onImgSelect(imgIdx) {
    resetEditor()
    const input = document.querySelector('.editor-txt')
    input.value = ''
    setImg(imgIdx)
    updateLineButtonsPosition()
    renderMeme()
}

function onSavedMemeSelect(index) {
    //TODO: When image on meme page, the right image and editor should be opend
}

function onSwitchLine() {
    switchLine()
    updateLineButtonsPosition()
    renderMeme()
}

function onSwitchLineClick(line) {
    if (!line) return;
    switchLineClick(line);
    onDefaultLines(line.txt);
    renderMeme();
}

function onAddLine() {
    addLine()
    renderMeme()
}

function drawText(text, x, y, color, size, selectedLineIdx, lineIdx, selectedLine, align = 'center', stroke) {
    gCtx.fillStyle = color
    gCtx.strokeStyle = stroke
    gCtx.font = `${size}px Impact`
    gCtx.textBaseline = 'middle'
    const meme = getMeme()
    const line = meme.lines[lineIdx]
    if (selectedLineIdx === lineIdx) {
        gCtx.save();
        gCtx.textAlign = align
        gCtx.translate(x, y)
        gCtx.rotate(rotationAngle)
        gCtx.fillText(text, 0, 0)
        gCtx.strokeText(text, 0, 0)
        gCtx.restore()
        drawRect(x, y, size, text, selectedLine, lineIdx, selectedLineIdx)
        line.rotationAngle = rotationAngle;
    } else {
        gCtx.save()
        gCtx.textAlign = align
        gCtx.translate(x, y)
        gCtx.rotate(getPrevLineAngle())
        gCtx.fillText(text, 0, 0)
        gCtx.strokeText(text, 0, 0)
        gCtx.restore()
    }
}

function drawRect(x, y, size, text, selectedLine, lineIdx, selectedLineIdx) {
    const textWidth = gCtx.measureText(text).width;
    const boxPadding = 10;
    const boxX = x - textWidth / 2 - boxPadding;
    const boxY = y - boxPadding;
    const boxWidth = textWidth + boxPadding * 4;
    const boxHeight = size + boxPadding * 2;

    if (gIsAnyLineClicked === -1) return
    if (selectedLineIdx !== lineIdx) {
        gCtx.beginPath();
        gCtx.rect(boxX, boxY, boxWidth, boxHeight);
        gCtx.lineWidth = 2;
        gCtx.strokeStyle = 'black';
        gCtx.stroke();
        gCtx.closePath();
    } else {
        gCtx.save();
        gCtx.translate(x, y);
        gCtx.rotate(rotationAngle);
        gCtx.beginPath();
        gCtx.rect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight);
        gCtx.lineWidth = 2;
        gCtx.strokeStyle = 'red';
        gCtx.stroke();
        gCtx.closePath();
        gCtx.restore();
    }
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

function alignText(align) {
    const line = gMeme.lines[gMeme.selectedLineIdx];
    const canvas = document.querySelector('#my-canvas');
    const ctx = canvas.getContext('2d');
    switch (align) {
        case 'left':
            line.location.locationX = 50;
            break;
        case 'right':
            line.location.locationX = canvas.width - ctx.measureText(line.txt).width - 5;
            break;
        case 'center':
            line.location.locationX = (canvas.width - ctx.measureText(line.txt).width) / 2;
            break;
        default:
            break;
    }
    updateLineButtonsPosition()
    renderMeme();
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

function onDown(ev) {
    ev.preventDefault()
    const pos = getEvPos(ev)
    const { offsetX, offsetY } = ev

    const clickedLine = gMeme.lines.find((line) => {

        const { location } = line;
        const boxWidth = gCtx.measureText(line.txt).width + 50;
        const boxHeight = line.size + 50;
        return (
            offsetX >= location.locationX - boxWidth / 2 &&
            offsetX <= location.locationX + boxWidth / 2 &&
            offsetY >= location.locationY &&
            offsetY <= location.locationY + boxHeight
        );
    });
    gSelectedEmoji = findEmojiAtPosition(pos.x, pos.y);

    if (clickedLine) {
        // onSwitchLineClick(clickedLine)
        // activateTextEditing(clickedLine)
        setLineClick(1)
        isLineClicked = true
        setLineDrag(true);
        gStartPos = pos;
        document.body.style.cursor = 'grabbing';
        gIsAnyLineClicked = 0
        updateLineButtonsPosition()
        renderMeme()
    } else if (gSelectedEmoji) {
        gSelectedEmoji.setEmojiDrag = true;
        gSelectedEmoji.offsetX = pos.x - gSelectedEmoji.x;
        gSelectedEmoji.offsetY = pos.y - gSelectedEmoji.y;
        document.body.style.cursor = 'grabbing';
    }
}

function onMove(ev) {
    const { isDrag } = getLine()
    if (isRotating) {
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        rotationAngle = Math.atan2(dy, dx)
        updateLineButtonsPosition()
        renderMeme()
    } else if (isDrag) {
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        moveLine(dx, dy)
        gStartPos = pos
        setLineClick(1)
        updateLineButtonsPosition()
        renderMeme()
    } else if (gSelectedEmoji && gSelectedEmoji.setEmojiDrag) {
        const pos = getEvPos(ev);
        gSelectedEmoji.x = pos.x - gSelectedEmoji.offsetX;
        gSelectedEmoji.y = pos.y - gSelectedEmoji.offsetY;
        renderMeme();
    }
}

function onUp() {
    setLineDrag(false)
    isRotating = false
    isLineClicked = false
    rotationAngle = 0
    document.body.style.cursor = "grab";
    if (gSelectedEmoji) {
        gSelectedEmoji.setEmojiDrag = false;
        gSelectedEmoji = null;
    }
}

function handleCanvasClick(event) { // TODO: GET GMEME FROM MEME SERVICE
    const { offsetX, offsetY } = event
    const clickedLine = gMeme.lines.find((line) => {
        const { location } = line;
        const boxWidth = gCtx.measureText(line.txt).width + 40;
        const boxHeight = line.size + 20;
        return (
            offsetX >= location.locationX - boxWidth / 2 &&
            offsetX <= location.locationX + boxWidth / 2 &&
            offsetY >= location.locationY &&
            offsetY <= location.locationY + boxHeight
        )
    })
    if (clickedLine) {
        onSwitchLineClick(clickedLine)
        activateTextEditing(clickedLine)
        
        gIsAnyLineClicked = 0
        updateLineButtonsPosition()
    } else {
        
        gIsAnyLineClicked = -1
        updateLineButtonsPosition()
        renderMeme()
    }
}

function renderEmojisSection() {
    let emojiContainer = document.querySelector('.emojis-section');
    const emojis = ["😀", "🌞", "🌈", "🌻", "🐶", "🐱", "🍕", "🎉", "⚽", "🚀", "🌊", "🎨", "📷", "🎸", "🍔"];
    emojis.forEach((emoji) => {
        const button = document.createElement("button");
        button.textContent = emoji;
        button.addEventListener('click', () => {
            addEmojis(emoji);
        });
        emojiContainer.appendChild(button);
    });
}

function clearRect() {
    isLineClicked = false
}

function addListeners() {
    addMouseListeners();
    addTouchListeners();
    document.querySelector('.rotate-button').addEventListener('click', onRotate);
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown);
    gElCanvas.addEventListener('mousemove', onMove);
    gElCanvas.addEventListener('mouseup', onUp);
    gElCanvas.addEventListener('click', handleCanvasClick);

}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown);
    gElCanvas.addEventListener('touchmove', onMove);
    gElCanvas.addEventListener('touchend', onUp);
}
















