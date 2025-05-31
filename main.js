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
