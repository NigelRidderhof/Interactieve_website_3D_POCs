// document.body.onload = function(){

// }

let startScreen = document.querySelector(".startScreen");
startScreen.addEventListener('click', startTheScreen);

function startTheScreen() {
    console.log("Started");
    var context = new AudioContext();
    startScreen.parentNode.removeChild(startScreen);
    console.clear();
}