'use strict'

function renderGallery() {
    
const imgs = onGetImgs()
       var strHTML = ''
    imgs.map( img => {
        strHTML += `<button onclick="openDialog(); onImgSelect('${img.id}');" class="image-btn"><img src="${img.url}"></button>`
     }).join('')

document.querySelector('.gallery').innerHTML = strHTML

}

function onGetImgs() {
    return getImgs()
}