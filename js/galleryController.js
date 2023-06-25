'use strict'

const PAGE_SIZE = 16
let currentPage = 1

function renderGallery() {
  const imgs = getImgs()
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE

  let strHTML = '';
  imgs.slice(startIndex, endIndex).forEach((img) => {
    const { id, url } = img;
    strHTML += `<button onclick="openDialog(); onImgSelect('${id}');" class="image-btn"><img src="${url}" title="Click to edit"></button>`
  });

  document.querySelector('.gallery').innerHTML = strHTML
  renderPagination();
}


function renderSavedMemes() {
  const savedMemes = getSavedMemes()
  let strHTML = '';

  savedMemes.forEach((meme, index) => {
    const imgUrl = meme.img
    if (imgUrl) {
      strHTML += `<button onclick="openDialog(); onSavedMemeSelect(${index});" class="image-btn"><img src="${imgUrl}"></button>`
    }
  });

  document.querySelector('.saved-memes').innerHTML = strHTML;
}

// function _rndKeyWords() {
//   let keyWordsArr = [funny,cute]
// }

function toggleMenu() {
  document.body.classList.toggle('menu-open');
}

function renderPagination() {
  const imgs = getImgs();
  const totalPages = Math.ceil(imgs.length / PAGE_SIZE)
  let prevPageBtn = document.querySelector('.prev-page-btn')
  let nextPageBtn = document.querySelector('.next-page-btn')

  if (!prevPageBtn) {
  
    prevPageBtn = document.querySelector('.prev-page-btn')
    prevPageBtn.addEventListener('click', prevPage)

    nextPageBtn = document.querySelector('.next-page-btn')
    nextPageBtn.addEventListener('click', nextPage)
  }

  if (currentPage === 1) {
    prevPageBtn.disabled = true
  } else {
    prevPageBtn.disabled = false
  }

  if (currentPage === totalPages) {
    nextPageBtn.disabled = true
  } else {
    nextPageBtn.disabled = false
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--
    renderGallery()
  }
}

function nextPage() {
  const imgs = getImgs();
  const totalPages = Math.ceil(imgs.length / PAGE_SIZE);

  if (currentPage < totalPages) {
    currentPage++;
    renderGallery();
  }
}

function showTooltip() {
  const tooltip = document.getElementById('info-tooltip');
  tooltip.style.opacity = '1';
}

function hideTooltip() {
  const tooltip = document.getElementById('info-tooltip');
  tooltip.style.opacity = '0';
  tooltip.style.right = 'calc(100% + 10px)';
}

