import { DouDiZhuGame } from './game.js';
// import { initToolbar } from '@stagewise/toolbar';

// Stagewise Toolbar Integration - temporarily disabled
// const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
// if (isDevelopment) {
//   const stagewiseConfig = {
//     plugins: []
//   };
//   initToolbar(stagewiseConfig);
// }

let game;
let backgroundMusic;
let musicToggleButton;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    
    // Check if all required containers exist
    const humanCardsContainer = document.getElementById('human-cards');
    const player1Container = document.getElementById('player1');
    const player2Container = document.getElementById('player2');
    
    console.log('Required containers:');
    console.log('- Human cards container:', humanCardsContainer);
    console.log('- Player 1 container:', player1Container);
    console.log('- Player 2 container:', player2Container);
    
    if (!humanCardsContainer) {
        console.error('ERROR: human-cards container not found!');
        return;
    }
    
    try {
        game = new DouDiZhuGame();
        console.log('Game initialized successfully:', game);
        console.log('Players after init:', game.players);
        console.log('Deck length after init:', game.deck.length);
        
        // Initialize background music
        initializeBackgroundMusic();
        
        // Force debug after a short delay
        setTimeout(() => {
            console.log('Running debug check...');
            game.debugCheckGameState();
        }, 1000);
        
    } catch (error) {
        console.error('Error initializing game:', error);
        console.error('Error stack:', error.stack);
    }
});

// Background Music Functions
function initializeBackgroundMusic() {
    backgroundMusic = document.getElementById('background-music');
    musicToggleButton = document.getElementById('music-toggle');
    
    if (!backgroundMusic || !musicToggleButton) {
        console.error('Background music elements not found');
        return;
    }
    
    // Set default volume
    backgroundMusic.volume = 0.3;
    
    // Handle autoplay restrictions
    backgroundMusic.addEventListener('canplaythrough', () => {
        console.log('Background music loaded and ready to play');
        attemptAutoplay();
    });
    
    // Handle play/pause errors
    backgroundMusic.addEventListener('error', (e) => {
        console.error('Error loading background music:', e);
        musicToggleButton.style.display = 'none';
    });
    
    // Music toggle button event
    musicToggleButton.addEventListener('click', toggleMusic);
    
    // Try to start music when user first interacts with the page
    document.addEventListener('click', attemptAutoplay, { once: true });
    document.addEventListener('keydown', attemptAutoplay, { once: true });
    
    console.log('Background music initialized');
}

function attemptAutoplay() {
    if (!backgroundMusic) return;
    
    const playPromise = backgroundMusic.play();
    
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('Background music started successfully');
                updateMusicButton(false); // false = not muted
            })
            .catch((error) => {
                console.log('Autoplay prevented by browser:', error);
                updateMusicButton(true); // true = muted/paused
            });
    }
}

function toggleMusic() {
    if (!backgroundMusic) return;
    
    if (backgroundMusic.paused) {
        backgroundMusic.play()
            .then(() => {
                updateMusicButton(false);
                console.log('Background music resumed');
            })
            .catch((error) => {
                console.error('Error playing background music:', error);
            });
    } else {
        backgroundMusic.pause();
        updateMusicButton(true);
        console.log('Background music paused');
    }
}

function updateMusicButton(isMuted) {
    if (!musicToggleButton) return;
    
    if (isMuted) {
        musicToggleButton.textContent = '🔇';
        musicToggleButton.classList.add('muted');
        musicToggleButton.title = 'Click to enable music';
    } else {
        musicToggleButton.textContent = '🎵';
        musicToggleButton.classList.remove('muted');
        musicToggleButton.title = 'Click to mute music';
    }
}
