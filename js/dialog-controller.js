'use strict'

const elDialog = document.querySelector('.dialog')
elDialog.addEventListener('click', ev => {
    const dialogDimensions = elDialog.getBoundingClientRect()
    if (
        ev.clientX < dialogDimensions.left ||
        ev.clientX > dialogDimensions.right ||
        ev.clientY < dialogDimensions.top ||
        ev.clientY > dialogDimensions.bottom
    ) {
        elDialog.close()
    }
})

function openDialog() {
    document.querySelector('.dialog').showModal()
}

function closeDialog() {
    document.querySelector('.dialog').close()
}



