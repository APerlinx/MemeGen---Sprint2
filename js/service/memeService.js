'use strict'
const STORAGE_KEY = 'memeDB'

var gImgs = []
const gKeyWord = ['funny','bad','animal','happy','sad','baby','cat']
_createImgObj()

let gRndLines = ['Yoo', 'Look at you', 'are you ok?', 'Happy weekend', 'This is what\'s up', ' Wasssssuuuppp']

var gMeme = {
    selectedImgId: 2,
    selectedLineIdx: 0,
    lines: [

        {
            defaultTxt: 'Make this MemeGen great',
            txt: 'Make this MemeGen great',
            size: 30,
            color: 'White',
            location: { locationX: 0, locationY: 0 }
        },
        {
            defaultTxt: 'Make this MemeGen great',
            txt: 'Hello',
            size: 20,
            color: 'yellow',
            location: { locationX: 0, locationY: 0 }
        }

    ],
    get img() {
        const selectedImg = gImgs.find(img => img.id === this.selectedImgId);
        return selectedImg ? selectedImg.url : null;
    }
}
// var gKeywordSearchCountMap = {'funny': 12,'cat': 16, 'baby': 2}

function saveMeme(canvasData) {
    const savedMemes = getSavedMemes();
    savedMemes.push({ img: canvasData });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedMemes));
}

function getSavedMemes() {
    const savedMemesJSON = localStorage.getItem(STORAGE_KEY);
    return savedMemesJSON ? JSON.parse(savedMemesJSON) : [];
}


function getRndMeme() {

}

function switchLineClick(lineClicked) {
    var lineIdx = gMeme.lines.findIndex(line => line.txt === lineClicked.txt)
    gMeme.selectedLineIdx = lineIdx
}

function SwitchLine() {
    gMeme.selectedLineIdx++
    if (gMeme.selectedLineIdx > gMeme.lines.length - 1) {
        gMeme.selectedLineIdx = 0
        return
    }
}

function addLine() {
    gMeme.lines.push(
        {
            defaultTxt: 'New line',
            txt: 'New line',
            size: 40,
            color: 'White',
            location: { locationX: 0, locationY: 0 }
        }
    )
}

function changeTxtColor(color) {
    gMeme.lines[0].color = color
}

function changeTxtSize(size) {
    if (parseInt(size) > 40) return
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
    const inputElement = document.querySelector('input[list="keywords"]');
    const selectedKeyword = inputElement.value;
  
    if (selectedKeyword.trim() === '') {
      return gImgs; // Return all images if no keyword is selected
    }
  
    const memes = gImgs.filter((meme) => {
      return meme.keywords.includes(selectedKeyword);
    });
    console.log('memes', memes);
    return memes;
  }


function setLineTxt(text) {
    if (!text) {
        text = gMeme.lines[0].defaultTxt
    }
    gMeme.lines[0].txt = text

}

function _createImgObj() {
    let images = []
    for (let i = 1; i <= 18; i++) {
        images.push({ id: i, url: `img/meme-imgs (square)/${i}.jpg`, keywords: [gKeyWord[getRandomIntInclusive(0, 6)], gKeyWord[getRandomIntInclusive(0, 6)]] })
    }
    gImgs = images
}

function _saveMemeToStorage() {
    const memes = loadFromStorage(STORAGE_KEY) || [];
    memes.push(gMeme);
    saveToStorage(STORAGE_KEY, memes);
}

