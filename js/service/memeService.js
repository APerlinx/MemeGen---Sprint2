'use strict'

var gImgs = [
    { id: 1, url: 'img/meme-imgs (square)/1.jpg', keywords: ['great again', 'politics'] },
    { id: 2, url: 'img/meme-imgs (square)/2.jpg', keywords: ['cute', 'dogs'] },
    { id: 3, url: 'img/meme-imgs (square)/3.jpg', keywords: ['cute', 'dogs'] },
    { id: 4, url: 'img/meme-imgs (square)/4.jpg', keywords: ['cute', 'dogs'] }
]

var gMeme = {
    selectedImgId: 2,
    selectedLineIdx: 0,
    lines: [
      
        {
            defaultTxt:'Make this MemeGen great',
            txt: 'Make this MemeGen great',
            size: 30,
            color: 'blue'
        }
    ],
    get img() {
        const selectedImg = gImgs.find(img => img.id === this.selectedImgId);
        return selectedImg ? selectedImg.url : null;
    }
}
// var gKeywordSearchCountMap = {'funny': 12,'cat': 16, 'baby': 2}

function changeTxtColor(color) {
    gMeme.lines[0].color = color
}

function changeTxtSize(size) {
    if(parseInt(size) > 40) return
    gMeme.lines[0].size += parseInt(size)
    console.log('var', gMeme.lines[0].size);
}

function setImg(imgIdx) {
    gMeme.selectedImgId = parseInt(imgIdx)
    console.log('gMeme.slectedImgId', gMeme.selectedImgId);
}

function getMeme() {
    return gMeme
}

function getImgs() {
    return gImgs
}

function setLineTxt(text) {
    if(!text) text = gMeme.lines[0].defaultTxt
    gMeme.lines[0].txt = text
}

