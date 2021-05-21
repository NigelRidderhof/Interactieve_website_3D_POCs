let startScreen = document.querySelector(".startScreen");
startScreen.addEventListener('click', startTheScreen);

function startTheScreen() {
    startScreen.parentNode.removeChild(startScreen);
    console.clear();
}