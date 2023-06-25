'use strict'

var gEmojis = []
  
function addEmojis(emoji) {
    let canvas = document.getElementById("my-canvas");
    let ctx = canvas.getContext("2d");
    let x = getRandomIntInclusive(1, 350)
    let y = getRandomIntInclusive(200, 350)
    ctx.font = "50px Impact";
    ctx.fillText(`${emoji}`, x,y);

    let emojiObj = {
        emoji: emoji,
        x: x,
        y: y,
        width: 50, 
        height: 50, 
        setEmojiDrag: false,
        offsetX: 0, 
        offsetY: 0
      }
 gEmojis.push(emojiObj)
}

function findEmojiAtPosition(x, y) {
    for (var i = 0; i < gEmojis.length; i++) {
      var emoji = gEmojis[i];
      if (
        x >= emoji.x &&
        x <= emoji.x + emoji.width &&
        y >= emoji.y &&
        y <= emoji.y + emoji.height
      ) {
        return emoji;
      }
    }
    return null;
  }
  

  