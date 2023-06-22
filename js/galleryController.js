'use strict'

function renderGallery() {
  const imgs = getImgs();
 
  let strHTML = '';
  imgs.forEach((img) => {
    const { id, url } = img;
    strHTML += `<button onclick="openDialog(); onImgSelect('${id}');" class="image-btn"><img src="${url}"></button>`;
  });
  document.querySelector('.gallery').innerHTML = strHTML;
}

function renderSavedMemes() {
  const savedMemes = getSavedMemes();
  let strHTML = '';

  savedMemes.forEach((meme, index) => {
    const imgUrl = meme.img; // Assuming the URL of the saved meme is stored in `meme.img`
    if (imgUrl) {
      strHTML += `<button onclick="openDialog(); onSavedMemeSelect(${index});" class="image-btn"><img src="${imgUrl}"></button>`;
    }
  });

  document.querySelector('.saved-memes').innerHTML = strHTML;
}

function _rndKeyWords() {
  let keyWordsArr = [funny,cute]
}

function toggleMenu() {
  document.body.classList.toggle('menu-open');
}