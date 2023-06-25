'use strict'

const STORAGE_KEY = 'memeDB'
const gKeyWord = ['funny','bad','animal','happy','sad','baby','cat']
const gKeywordSearchCountMap = {}
let gImgs = []
let gRndLines = ['When you solve it', 'Look', 'stupid', 'WTF', 'weekend?', ' Wasssssuuuppp']
_createImgObj()
let gMeme = {
    selectedImgId: 2,
    selectedLineIdx: 0,
    lines: [

        {
            defaultTxt: 'Default text',
            txt: 'Default text',
            size: 30,
            color: 'White',
            location: { locationX: 200, locationY: 100 },
            rotationAngle: 0
        },
        {
            defaultTxt: 'Default text',
            txt: 'Default text',
            size: 30,
            color: 'black',
            location: { locationX: 200, locationY: 20 },
            rotationAngle: 0
        }

    ],
    get img() {
        const selectedImg = gImgs.find(img => img.id === this.selectedImgId);
        return selectedImg ? selectedImg.url : null;
    }
}

function createKeyWordMap() {
  const gKeywordSearchCountMap = gImgs.reduce((countMap, imgObj) => {
    const keywords = imgObj.keywords;

    keywords.forEach(keyword => {
      countMap[keyword] = (countMap[keyword] || 0) + 1;
    });

    return countMap;
  }, {});
  return gKeywordSearchCountMap;
}

function saveMeme(canvasData) {
    const savedMemes = getSavedMemes();
    savedMemes.push({ img: canvasData });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedMemes));
}

function getSavedMemes() {
    const savedMemesJSON = localStorage.getItem(STORAGE_KEY);
    return savedMemesJSON ? JSON.parse(savedMemesJSON) : [];
}

function getRndLines() {
   gMeme.lines[0].defaultTxt = gRndLines[getRandomIntInclusive(0, 5)]
   gMeme.lines[0].txt = gRndLines[getRandomIntInclusive(0, 5)]
   gMeme.lines[1].defaultTxt = gRndLines[getRandomIntInclusive(0, 5)]
   gMeme.lines[1].txt = gRndLines[getRandomIntInclusive(0, 5)]
}

function getPrevLineAngle() {
if(gMeme.selectedLineIdx === 0) return gMeme.lines[1].rotationAngle
if(gMeme.selectedLineIdx === 1) return gMeme.lines[0].rotationAngle
}

function switchLineClick(lineClicked) {
  gMeme.selectedLineIdx = gMeme.lines.findIndex(line => line.txt === lineClicked.txt);
  getPrevLineAngle(gMeme.selectedLineIdx)
}

function switchLine() {
  gMeme.selectedLineIdx++
  if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0;
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
  gMeme.lines[gMeme.selectedLineIdx].color = color
}

function changeTxtSize(size) {
    if (parseInt(size) > 40) return
    gMeme.lines[gMeme.selectedLineIdx].size += parseInt(size)
}

function setImg(imgIdx) {
    gMeme.selectedImgId = parseInt(imgIdx)
}

function getMeme() {
    return gMeme
}

function addImg(img) { // User image upload
  gImgs.unshift({ id: gImgs.length+1, url: `${img}`, keywords: [gKeyWord[getRandomIntInclusive(0, 6)], gKeyWord[getRandomIntInclusive(0, 6)]] })
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
    return memes;
  }

function setLineTxt(text) {
   if(gMeme.selectedLineIdx === 0) {
    if(!text) text = gMeme.lines[0].defaultTxt
    gMeme.lines[0].txt = text
   }  else if(gMeme.selectedLineIdx === 1) {
    if(!text) text = gMeme.lines[1].defaultTxt
      gMeme.lines[1].txt = text
   }
}

function deleteLine() {
    if (gMeme.lines.length === 1) {
      const line = gMeme.lines[0];
      line.defaultTxt = 'New Line';
      line.txt = 'New Line';
      line.size = 30;
      line.color = 'White';
      line.location = { locationX: 200, locationY: 50 };
    } else {
      gMeme.lines.splice(gMeme.selectedLineIdx, 1);
      if (gMeme.selectedLineIdx >= gMeme.lines.length) {
        gMeme.selectedLineIdx = gMeme.lines.length - 1;
      }
    }
    renderMeme();
  }
  
function resetEditor() {
    gMeme.lines.forEach((line, index) => {
      line.txt = line.defaultTxt;
      line.color = 'black';
      line.size = 30;
      line.location = gMeme.lines[index].location
    });
  
    // Set the default values for the first line
    if (gMeme.lines.length > 0) {
      const line1 = gMeme.lines[0];
      line1.defaultTxt = 'Meme';
      line1.txt = 'Meme';
      line1.size = 50;
      line1.color = 'White';
      line1.location = { locationX: 200, locationY: 100 }
    }
  
    // Set the default values for the second line
    if (gMeme.lines.length > 1) {
      const line2 = gMeme.lines[1];
      line2.defaultTxt = 'Gen';
      line2.txt = 'Gen';
      line2.size = 30;
      line2.color = 'black';
      line2.location = { locationX: 200, locationY: 20 }
    }
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

