// JavaScipt code voor het startscherm dat nodig is omdat een gebruiker eerst een interactie moet uitvoeren voordat audio mag spelen.

let startScreen = document.querySelector( ".startScreen" );
startScreen.addEventListener( 'click', startTheScreen );

function startTheScreen() {
    // Installeer en gebruik de CSS plugin om het startscherm weg te faden, om deze vervolgens te verwijderen. 
    createjs.CSSPlugin.install();
    startScreen.style.opacity = 1;
    createjs.Tween.get(startScreen).to( { opacity: 0 }, 800 );
    setTimeout( () => { 
        startScreen.parentNode.removeChild ( startScreen ); 
    }, 800 );
    
    // Start en pauseer de video zodat deze meteen zichtbaar is.
    const video = document.getElementById( 'video' );
    video.play();
    setTimeout( () => { 
        video.pause(); 
    }, 250 ); 

    console.clear();
}