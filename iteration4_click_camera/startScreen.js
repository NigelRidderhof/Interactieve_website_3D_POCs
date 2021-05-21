let startScreen = document.querySelector( ".startScreen" );
startScreen.addEventListener( 'click', startTheScreen );

function startTheScreen() {
    createjs.CSSPlugin.install();
    startScreen.style.opacity = 1;
    createjs.Tween.get(startScreen).to( { opacity: 0 }, 700 );
    setTimeout( function(){ startScreen.parentNode.removeChild( startScreen ); }, 700 );
    console.clear();
}