// Fight the Landlord Game Class
export class DouDiZhuGame {
    constructor() {
        this.deck = [];
        this.players = [
            { name: 'Player 1', cards: [], isHuman: true, role: null },
            { name: 'Computer 1', cards: [], isHuman: false, role: null },
            { name: 'Computer 2', cards: [], isHuman: false, role: null }
        ];
        this.landlordCards = [];
        this.currentPlayer = 0;
        this.landlord = -1;
        this.gamePhase = 'playing';
        this.lastPlayedCards = [];
        this.lastPlayer = -1;
        this.selectedCards = [];
        this.passCount = 0;
        // Web Audio context for simple sound effects
        this.audioCtx = null;
        this.cardImages = this.initializeCardImages();
        
        this.baseScore = 1;
        
        this.initializeGame();
        this.bindEvents();
    }

    // Initialize card image mapping with short names
    initializeCardImages() {
        const cardImages = {};
        
        // Based on actual files available in the images folder
        const actualMapping = {
            // Spades (using actual available files)
            'spade_a': 'sa.png',
            'spade_2': 's2.png',
            'spade_3': 's3.png',
            'spade_4': 's4.png',
            'spade_5': 's5.png',
            'spade_6': 's6.png',
            'spade_7': 's7.png',
            'spade_8': 's8.png',
            'spade_9': 's9.png',
            'spade_10': 'st.png',
            'spade_j': 'sj.png',
            'spade_q': 'sq.png',
            'spade_k': 'sk.png',
            
            // Hearts (using actual available files)
            'heart_a': 'ha.png',
            'heart_2': 'h2.png',
            'heart_3': 'h3.png',
            'heart_4': 'h4.png',
            'heart_5': 'h5.png',
            'heart_6': 'h6.png',
            'heart_7': 'h7.png',
            'heart_8': 'h8.png',
            'heart_9': 'h9.png',
            'heart_10': 'ht.png',
            'heart_j': 'hj.png',
            'heart_q': 'hq.png',
            'heart_k': 'hk.png',
            
            // Clubs (using actual available files)
            'club_a': 'ca.png',
            'club_2': 'c2.png',
            'club_3': 'c3.png',
            'club_4': 'c4.png',
            'club_5': 'c5.png',
            'club_6': 'c6.png',  // Added based on file listing
            'club_7': 'c7.png',
            'club_8': 'c8.png',
            'club_9': 'c9.png',
            'club_10': 'ct.png',
            'club_j': 'cj.png',
            'club_q': 'cq.png',
            'club_k': 'ck.png',
            
            // Diamonds (using actual available files)
            'diamond_a': 'da.png',
            'diamond_2': 'd2.png',
            'diamond_3': 'd3.png',
            'diamond_4': 'd4.png',
            'diamond_5': 'd5.png',
            'diamond_6': 'd6.png',
            'diamond_7': 'd7.png',
            'diamond_8': 'd8.png',
            'diamond_9': 'd9.png',
            'diamond_10': 'dt.png',
            'diamond_j': 'dj.png',
            'diamond_q': 'dq.png',
            'diamond_k': 'dk.png',
            
            // Jokers (using actual available files)
            'joker_small': 'jr.png',
            'joker_big': 'jb.png'
        };
        
        return actualMapping;
    }

    // Initialize game
    initializeGame() {
        this.createDeck();
        this.shuffleDeck();
        this.dealCards();
        this.assignLandlord();
        this.renderGame();
        this.updateGameControls();
    }

    // Create deck
    createDeck() {
        const suits = ['♠', '♥', '♣', '♦'];
        const ranks = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];
        
        this.deck = [];
        
        // Create normal cards (52 cards)
        for (let suit of suits) {
            for (let rank of ranks) {
                this.deck.push({
                    suit: suit,
                    rank: rank,
                    value: this.getCardValue(rank),
                    color: (suit === '♥' || suit === '♦') ? 'red' : 'black',
                    isJoker: false
                });
            }
        }
        
        // Add jokers (2 cards) - total 54 cards
        this.deck.push({ 
            suit: '', 
            rank: 'Small Joker', 
            value: 16, // Higher than 2 (value 15)
            color: 'black',
            isJoker: true 
        });
        this.deck.push({ 
            suit: '', 
            rank: 'Big Joker', 
            value: 17, // Highest value
            color: 'red',
            isJoker: true 
        });
        
        console.log(`Created deck with ${this.deck.length} cards`); // Should be 54
    }

    // Get card image key
    getCardImageKey(card) {
        if (card.rank === 'Small Joker') return 'joker_small';
        if (card.rank === 'Big Joker') return 'joker_big';
        
        const suitMap = { '♠': 'spade', '♥': 'heart', '♣': 'club', '♦': 'diamond' };
        const rankMap = { 
            'J': 'j', 'Q': 'q', 'K': 'k', 'A': 'a',
            '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '10': '10', '2': '2'
        };
        
        const suit = suitMap[card.suit] || 'spade';
        const rank = rankMap[card.rank] || card.rank.toLowerCase();
        
        return `${suit}_${rank}`;
    }

    // Deal cards according to Fight the Landlord rules
    dealCards() {
        // Verify we have exactly 54 cards
        if (this.deck.length !== 54) {
            console.error(`Deck should have 54 cards, but has ${this.deck.length}`);
            return;
        }
        
        // Deal 17 cards to each player (51 total)
        for (let i = 0; i < 17; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.deck.length > 0) {
                    this.players[j].cards.push(this.deck.pop());
                }
            }
        }
        
        // Remaining 3 cards as landlord bonus cards
        this.landlordCards = this.deck.splice(0, 3);
        
        console.log(`Player cards: ${this.players[0].cards.length}, ${this.players[1].cards.length}, ${this.players[2].cards.length}`);
        console.log(`Landlord bonus cards: ${this.landlordCards.length}`);
        
        // Sort each player's cards by Fight the Landlord ranking
        this.players.forEach(player => {
            this.sortCards(player.cards);
        });
    }

    // Assign landlord without bidding (player 1 by default)
    assignLandlord() {
        this.landlord = 0; // Human player is landlord

        this.players.forEach((player, index) => {
            player.role = index === this.landlord ? 'landlord' : 'peasant';
        });

        this.players[this.landlord].cards.push(...this.landlordCards);
        this.sortCards(this.players[this.landlord].cards);
        this.landlordCards = [];

        this.gamePhase = 'playing';
        this.currentPlayer = this.landlord;
        this.baseScore = 1;

        this.updateMessage(`${this.players[this.landlord].name} is the landlord. Game starts!`);
    }

    // Get card value according to Fight the Landlord ranking
    // 3 < 4 < 5 < 6 < 7 < 8 < 9 < 10 < J < Q < K < A < 2 < Small Joker < Big Joker
    getCardValue(rank) {
        const values = {
            '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
            'J': 11, 'Q': 12, 'K': 13, 'A': 14, '2': 15,
            'Small Joker': 16, 'Big Joker': 17
        };
        return values[rank] || 0;
    }

    // Sort cards by Fight the Landlord ranking (lowest to highest)
    sortCards(cards) {
        cards.sort((a, b) => {
            if (a.value !== b.value) {
                return a.value - b.value;
            }
            // If same rank, sort by suit for consistency
            return a.suit.localeCompare(b.suit);
        });
    }

    // Compare two cards according to Fight the Landlord rules
    compareCards(card1, card2) {
        return card1.value - card2.value;
    }

    // Check if a card is higher than another
    isCardHigher(card1, card2) {
        return this.compareCards(card1, card2) > 0;
    }

    // Shuffle deck
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    // Render game interface
    renderGame() {
        this.renderPlayerCards();
        this.renderLandlordCards();
        this.updatePlayerInfo();
        this.updateGameControls();
    }

    // Render player cards
    renderPlayerCards() {
        const humanCardsContainer = document.getElementById('human-cards');
        humanCardsContainer.innerHTML = '';
        
        this.players[0].cards.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index);
            humanCardsContainer.appendChild(cardElement);
        });
        
        // Render computer player card backs
        this.renderComputerCards(1, 'player1');
        this.renderComputerCards(2, 'player2');
    }

    // Render computer cards with enhanced overlapping and visual effects
    renderComputerCards(playerIndex, containerId) {
        const container = document.querySelector(`#${containerId} .player-cards`);
        container.innerHTML = '';
        
        const cardCount = this.players[playerIndex].cards.length;
        const maxDisplayCards = Math.min(cardCount, 15); // Increased to show more cards
        const isVertical = containerId === 'player1'; // Left player is vertical
        
        for (let i = 0; i < maxDisplayCards; i++) {
            const cardBack = document.createElement('div');
            cardBack.className = 'card card-back-computer';
            
            // Create enhanced card back design
            const cardBackInner = document.createElement('div');
            cardBackInner.className = 'card-back-inner';
            
            const pattern = document.createElement('div');
            pattern.className = 'card-back-pattern';
            pattern.innerHTML = '🃏';
            
            cardBackInner.appendChild(pattern);
            cardBack.appendChild(cardBackInner);
            
            // Apply enhanced positioning to all cards (including first one for proper base)
            const totalCards = maxDisplayCards;
            const cardIndex = i;
            
            if (isVertical) {
                // Vertical layout for left player - enhanced overlap
                if (i > 0) {
                    const baseOverlap = -50;
                    const overlapVariation = Math.max(-15, cardCount * -2); // Tighter with more cards
                    const finalOverlap = baseOverlap + overlapVariation;
                    cardBack.style.marginTop = `${finalOverlap}px`;
                    
                    // Slight horizontal offset for natural look - reduced to prevent overflow
                    const horizontalOffset = (Math.sin(cardIndex / totalCards * Math.PI) * 2) - 1; // Reduced from 8 to 2, and -4 to -1
                    cardBack.style.marginLeft = `${horizontalOffset}px`;
                    
                    // Natural rotation for card fanning
                    const maxRotation = Math.min(15, totalCards * 1.5);
                    const rotation = (cardIndex / (totalCards - 1) - 0.5) * maxRotation;
                    cardBack.style.transform = `rotate(${rotation}deg)`;
                } else {
                    // First card as base
                    cardBack.style.marginTop = '0px';
                    cardBack.style.marginLeft = '0px';
                    cardBack.style.transform = 'rotate(0deg)';
                }
                
                // Progressive z-index for proper layering
                cardBack.style.zIndex = 50 - i;
                
            } else {
                // Horizontal layout for top player - enhanced overlap
                if (i > 0) {
                    const baseOverlap = -45;
                    const overlapVariation = Math.max(-20, cardCount * -1.5); // Adjust based on card count
                    const finalOverlap = baseOverlap + overlapVariation;
                    cardBack.style.marginLeft = `${finalOverlap}px`;
                    
                    // Natural arc effect for horizontal fanning
                    const arcHeight = Math.sin((cardIndex / (totalCards - 1)) * Math.PI) * 12;
                    cardBack.style.marginTop = `${arcHeight}px`;
                    
                    // Natural rotation for card fanning
                    const maxRotation = Math.min(20, totalCards * 1.2);
                    const rotation = (cardIndex / (totalCards - 1) - 0.5) * maxRotation;
                    cardBack.style.transform = `rotate(${rotation}deg)`;
                } else {
                    // First card as base - explicitly set to ensure no CSS interference
                    cardBack.style.marginLeft = '0px';
                    cardBack.style.marginTop = '0px';
                    cardBack.style.transform = 'rotate(0deg)';
                }
                
                // Progressive z-index for proper layering
                cardBack.style.zIndex = 50 - i;
            }
            
            // Enhanced hover interactions
            cardBack.addEventListener('mouseenter', () => {
                cardBack.style.zIndex = 150;
                cardBack.style.transition = 'all 0.2s ease-out';
                
                if (isVertical) {
                    cardBack.style.transform = 'scale(1.15) rotate(0deg)';
                } else {
                    cardBack.style.transform = 'translateY(-15px) scale(1.15) rotate(0deg)';
                }
                
                // Add glow effect
                cardBack.style.boxShadow = '0 15px 40px rgba(57, 73, 171, 0.4), 0 0 20px rgba(57, 73, 171, 0.3)';
                cardBack.style.borderColor = '#5c6bc0';
            });
            
            cardBack.addEventListener('mouseleave', () => {
                cardBack.style.zIndex = 50 - i;
                cardBack.style.transition = 'all 0.3s ease-out';
                
                // Restore original position and rotation
                if (isVertical) {
                    const maxRotation = Math.min(15, totalCards * 1.5);
                    const rotation = i > 0 ? (i / (totalCards - 1) - 0.5) * maxRotation : 0;
                    cardBack.style.transform = `rotate(${rotation}deg) scale(1)`;
                } else {
                    const maxRotation = Math.min(20, totalCards * 1.2);
                    const rotation = i > 0 ? (i / (totalCards - 1) - 0.5) * maxRotation : 0;
                    cardBack.style.transform = `rotate(${rotation}deg) scale(1)`;
                }
                
                // Restore original shadow and border
                cardBack.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                cardBack.style.borderColor = '#1a237e';
            });
            
            container.appendChild(cardBack);
        }
        
        // Enhanced card count indicator with better styling
        if (cardCount > maxDisplayCards) {
            const moreCards = document.createElement('div');
            moreCards.className = 'more-cards-indicator';
            moreCards.innerHTML = `<strong>+${cardCount - maxDisplayCards}</strong><br><small>more cards</small>`;
            moreCards.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 240, 240, 0.95))';
            moreCards.style.backdropFilter = 'blur(10px)';
            moreCards.style.border = '2px solid rgba(255, 255, 255, 0.3)';
            moreCards.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            container.appendChild(moreCards);
        }
    }

    // Create card element
    createCardElement(card, index) {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.color}`;
        cardElement.dataset.index = index;
        
        // Get corresponding image
        const imageKey = this.getCardImageKey(card);
        const imagePath = this.cardImages[imageKey];
        
        if (imagePath) {
            cardElement.style.backgroundImage = `url('./images/${imagePath}')`;
            cardElement.classList.add('has-image');
        }
        
        const rankElement = document.createElement('div');
        rankElement.textContent = card.rank;
        cardElement.appendChild(rankElement);
        
        const suitElement = document.createElement('div');
        suitElement.textContent = card.suit;
        cardElement.appendChild(suitElement);
        
        cardElement.addEventListener('click', () => this.selectCard(index));
        
        return cardElement;
    }

    // Select card
    selectCard(index) {
        if (this.gamePhase !== 'playing' || this.currentPlayer !== 0) return;
        
        const cardElement = document.querySelector(`[data-index="${index}"]`);
        
        if (this.selectedCards.includes(index)) {
            this.selectedCards = this.selectedCards.filter(i => i !== index);
            cardElement.classList.remove('selected');
        } else {
            this.selectedCards.push(index);
            cardElement.classList.add('selected');
        }
        
        this.updateGameControls();
    }

    // Render landlord cards
    renderLandlordCards() {
        const container = document.getElementById('landlord-deck');
        container.innerHTML = '';
        
        if (this.landlord >= 0) {
            container.classList.remove('hidden');
            this.landlordCards.forEach(card => {
                const cardElement = this.createCardElement(card, -1);
                cardElement.style.pointerEvents = 'none';
                container.appendChild(cardElement);
            });
        } else {
            container.classList.add('hidden');
        }
    }

    // Update player info
    updatePlayerInfo() {
        this.players.forEach((player, index) => {
            const playerElement = document.getElementById(`player${index}`);
            const cardCountElement = playerElement.querySelector('.card-count');
            cardCountElement.textContent = `${player.cards.length} cards`;
            
            // Update role indicators
            playerElement.classList.remove('landlord', 'farmer', 'peasant');
            if (player.role === 'landlord') {
                playerElement.classList.add('landlord');
            } else if (player.role === 'peasant') {
                // Keep 'farmer' class for backward compatibility with existing CSS
                playerElement.classList.add('farmer');
            }
        });
        
        document.getElementById('current-player').textContent = `Current player: ${this.players[this.currentPlayer].name}`;
        document.getElementById('remaining-cards').textContent = `Remaining cards: ${this.deck.length}`;
        
        // Update message area styling based on current player role
        const messageArea = document.getElementById('message-area');
        messageArea.classList.remove('landlord-turn', 'peasant-turn');
        if (this.players[this.currentPlayer].role === 'landlord') {
            messageArea.classList.add('landlord-turn');
        } else if (this.players[this.currentPlayer].role === 'peasant') {
            messageArea.classList.add('peasant-turn');
        }
    }

    // Update game controls
    updateGameControls() {
        const playCardsBtn = document.getElementById('play-cards');
        const passTurnBtn = document.getElementById('pass-turn');
        const hintBtn = document.getElementById('hint');

        // Hide all buttons first
        playCardsBtn.style.display = 'none';
        passTurnBtn.style.display = 'none';
        hintBtn.style.display = 'none';

        if (this.gamePhase === 'playing' && this.currentPlayer === 0) {
            playCardsBtn.style.display = 'inline-block';
            passTurnBtn.style.display = 'inline-block';
            hintBtn.style.display = 'inline-block';
        }
    }


    // Play cards
    playCards() {
        if (this.selectedCards.length === 0 || !this.isValidPlay()) return;

        // Play confirmation sound
        this.playTone(660, 0.2);
        
        const selectedCardObjects = this.selectedCards.map(index => this.players[0].cards[index]);
        
        // Remove the selected cards
        this.selectedCards.sort((a, b) => b - a);
        this.selectedCards.forEach(index => {
            this.players[0].cards.splice(index, 1);
        });
        
        this.lastPlayedCards = selectedCardObjects;
        this.lastPlayer = this.currentPlayer;
        this.selectedCards = [];
        this.passCount = 0;
        
        this.renderPlayedCards(selectedCardObjects);
        this.renderGame();
        
        // Check if the game is over
        if (this.players[0].cards.length === 0) {
            this.endGame(0);
            return;
        }
        
        this.nextPlayer();
        this.updateMessage(`${this.players[this.lastPlayer].name} played`);
        
        // AI automatically plays cards
        if (this.currentPlayer !== 0) {
            setTimeout(() => this.aiPlay(), 1500);
        }
    }

    // Pass turn
    passTurn() {
        // Sound to indicate pass
        this.playTone(330, 0.15);
        this.passCount++;
        this.nextPlayer();
        
        if (this.passCount >= 2) {
            this.lastPlayedCards = [];
            this.lastPlayer = -1;
            this.passCount = 0;
            this.updateMessage(`${this.players[this.currentPlayer].name} can play freely`);
        } else {
            this.updateMessage(`${this.players[(this.currentPlayer + 2) % 3].name} passes`);
        }
        
        // AI makes a decision
        if (this.currentPlayer !== 0) {
            setTimeout(() => this.aiPlay(), 1500);
        }
        
        this.updateGameControls();
    }

    // AI plays cards
    aiPlay() {
        const player = this.players[this.currentPlayer];
        
        // Find cards the AI can play
        const validCards = this.findValidAICards(player.cards);
       if (validCards.length > 0) {
           this.aiPlayCards(validCards);
       } else {
           // Pass
            this.playTone(330, 0.15);
           this.passCount++;
            this.nextPlayer();
            
            if (this.passCount >= 2) {
                this.lastPlayedCards = [];
                this.lastPlayer = -1;
                this.passCount = 0;
                this.updateMessage(`${this.players[this.currentPlayer].name} can play freely`);
            } else {
                this.updateMessage(`${this.players[(this.currentPlayer + 2) % 3].name} passes`);
            }
            
            if (this.currentPlayer !== 0) {
                setTimeout(() => this.aiPlay(), 1500);
            }
        }
        
        this.updateGameControls();
    }

    // AI plays the selected cards
    aiPlayCards(cards) {
        // Simple sound for AI playing
        this.playTone(520, 0.15);
        // Remove these cards from the AI player's hand
        cards.forEach(card => {
            const index = this.players[this.currentPlayer].cards.findIndex(c => 
                c.rank === card.rank && c.suit === card.suit
            );
            if (index >= 0) {
                this.players[this.currentPlayer].cards.splice(index, 1);
            }
        });
        
        this.lastPlayedCards = cards;
        this.lastPlayer = this.currentPlayer;
        this.passCount = 0;
        
        this.renderPlayedCards(cards);
        this.renderGame();
        
        // Check if the game is over
        if (this.players[this.currentPlayer].cards.length === 0) {
            this.endGame(this.currentPlayer);
            return;
        }
        
        this.nextPlayer();
        this.updateMessage(`${this.players[this.lastPlayer].name} played`);
        
        if (this.currentPlayer !== 0) {
            setTimeout(() => this.aiPlay(), 1500);
        }
    }

    // Find cards the AI can play
    findValidAICards(cards) {
        if (this.lastPlayedCards.length === 0) {
            // Free play - play the smallest single card
            return [cards[0]];
        }
        
        const lastCombination = this.isValidCardCombination(this.lastPlayedCards);
        if (!lastCombination) return [];
        
        // Try to find a combination that can beat the last play
        const validPlays = this.findAllValidPlays(cards);
        
        for (let play of validPlays) {
            if (this.canBeatLastPlay(play)) {
                return play;
            }
        }
        
        return []; // No valid play found
    }
    
    // Find all possible valid card combinations from given cards
    findAllValidPlays(cards) {
        const validPlays = [];
        
        // Try singles
        for (let card of cards) {
            validPlays.push([card]);
        }
        
        // Try pairs
        const cardsByValue = {};
        cards.forEach(card => {
            if (!cardsByValue[card.value]) cardsByValue[card.value] = [];
            cardsByValue[card.value].push(card);
        });
        
        Object.values(cardsByValue).forEach(sameValueCards => {
            if (sameValueCards.length >= 2) {
                validPlays.push([sameValueCards[0], sameValueCards[1]]);
            }
            if (sameValueCards.length >= 3) {
                validPlays.push([sameValueCards[0], sameValueCards[1], sameValueCards[2]]);
            }
            if (sameValueCards.length >= 4) {
                validPlays.push([sameValueCards[0], sameValueCards[1], sameValueCards[2], sameValueCards[3]]);
            }
        });
        
        // Try rocket (both jokers)
        const jokers = cards.filter(card => card.isJoker);
        if (jokers.length === 2) {
            validPlays.push(jokers);
        }
        
        // Try sequences (simplified - just 5-card sequences for AI)
        const nonJokers = cards.filter(card => !card.isJoker && card.value < 14); // Exclude A and 2
        if (nonJokers.length >= 5) {
            const sequence = this.findSimpleSequence(nonJokers, 5);
            if (sequence) validPlays.push(sequence);
        }
        
        return validPlays.filter(play => this.isValidCardCombination(play));
    }
    
    // Helper function to find a simple 5-card sequence
    findSimpleSequence(cards, length) {
        const sortedCards = cards.sort((a, b) => a.value - b.value);
        const unique = [];
        
        // Get unique values
        let lastValue = -1;
        for (let card of sortedCards) {
            if (card.value !== lastValue) {
                unique.push(card);
                lastValue = card.value;
            }
        }
        
        // Look for consecutive sequence
        for (let i = 0; i <= unique.length - length; i++) {
            let isConsecutive = true;
            for (let j = 1; j < length; j++) {
                if (unique[i + j].value !== unique[i + j - 1].value + 1) {
                    isConsecutive = false;
                    break;
                }
            }
            
            if (isConsecutive) {
                return unique.slice(i, i + length);
            }
        }
        
        return null;
    }

    // Check if the selected cards form a valid play
    isValidPlay() {
        if (this.selectedCards.length === 0) return false;
        
        const selectedCardObjects = this.selectedCards.map(index => this.players[0].cards[index]);
        
        // First check if it's a valid card combination
        const combination = this.isValidCardCombination(selectedCardObjects);
        if (!combination) return false;
        
        if (this.lastPlayedCards.length === 0) {
            // Free play, any valid combination is allowed
            return true;
        }
        
        // Must play the same type with higher rank, or a bomb/rocket
        return this.canBeatLastPlay(selectedCardObjects);
    }

    // Validate whether a card combination is legal
    isValidCardCombination(cards) {
        if (cards.length === 0) return false;
        
        // Sort cards by value for easier analysis
        const sortedCards = [...cards].sort((a, b) => a.value - b.value);
        
        if (cards.length === 1) {
            // Single card - always valid
            return { type: 'single', rank: cards[0].value };
        }
        
        if (cards.length === 2) {
            // Pair - two cards of same rank
            if (sortedCards[0].value === sortedCards[1].value) {
                return { type: 'pair', rank: sortedCards[0].value };
            }
            
            // Rocket - both jokers
            if (this.isRocket(sortedCards)) {
                return { type: 'rocket', rank: 1000 }; // Highest possible rank
            }
            
            return false;
        }
        
        if (cards.length === 3) {
            // Three of a kind
            if (sortedCards[0].value === sortedCards[1].value && 
                sortedCards[1].value === sortedCards[2].value) {
                return { type: 'three', rank: sortedCards[0].value };
            }
            return false;
        }
        
        if (cards.length === 4) {
            // Check for bomb (four of a kind)
            if (sortedCards[0].value === sortedCards[1].value && 
                sortedCards[1].value === sortedCards[2].value &&
                sortedCards[2].value === sortedCards[3].value) {
                return { type: 'bomb', rank: sortedCards[0].value };
            }
            
            // Check for three + single
            const threeWithSingle = this.isThreeWithSingle(sortedCards);
            if (threeWithSingle) return threeWithSingle;
            
            return false;
        }
        
        if (cards.length === 5) {
            // Check for sequence (5 consecutive singles)
            const sequence = this.isSequence(sortedCards, 1);
            if (sequence) return sequence;
            
            // Check for three + pair
            const threeWithPair = this.isThreeWithPair(sortedCards);
            if (threeWithPair) return threeWithPair;
            
            return false;
        }
        
        if (cards.length >= 5) {
            // Check for longer sequences
            const sequence = this.isSequence(sortedCards, 1);
            if (sequence) return sequence;
        }
        
        if (cards.length >= 6) {
            // Check for pair sequences (minimum 3 pairs = 6 cards)
            const pairSequence = this.isPairSequence(sortedCards);
            if (pairSequence) return pairSequence;
            
            // Check for triplet sequences (minimum 2 triplets = 6 cards)
            const tripletSequence = this.isTripletSequence(sortedCards);
            if (tripletSequence) return tripletSequence;
        }
        
        // Check for complex combinations with attachments
        if (cards.length >= 6) {
            const complexCombination = this.isComplexCombination(sortedCards);
            if (complexCombination) return complexCombination;
        }
        
        return false;
    }
    
    // Check if cards form a rocket (both jokers)
    isRocket(cards) {
        if (cards.length !== 2) return false;
        
        const hasSmallJoker = cards.some(card => card.rank === 'Small Joker');
        const hasBigJoker = cards.some(card => card.rank === 'Big Joker');
        
        return hasSmallJoker && hasBigJoker;
    }
    
    // Check if cards form three + single
    isThreeWithSingle(cards) {
        if (cards.length !== 4) return false;
        
        const counts = this.getCardCounts(cards);
        const values = Object.keys(counts).map(Number);
        
        // Must have exactly one triple and one single
        const triples = values.filter(value => counts[value] === 3);
        const singles = values.filter(value => counts[value] === 1);
        
        if (triples.length === 1 && singles.length === 1) {
            return { type: 'three_single', rank: triples[0] };
        }
        
        return false;
    }
    
    // Check if cards form three + pair
    isThreeWithPair(cards) {
        if (cards.length !== 5) return false;
        
        const counts = this.getCardCounts(cards);
        const values = Object.keys(counts).map(Number);
        
        // Must have exactly one triple and one pair
        const triples = values.filter(value => counts[value] === 3);
        const pairs = values.filter(value => counts[value] === 2);
        
        if (triples.length === 1 && pairs.length === 1) {
            return { type: 'three_pair', rank: triples[0] };
        }
        
        return false;
    }
    
    // Check if cards form a sequence (consecutive singles)
    isSequence(cards, expectedCount = 1) {
        if (cards.length < 5) return false; // Minimum 5 cards for sequence
        
        // Remove jokers - they can't be part of sequences
        const nonJokers = cards.filter(card => !card.isJoker);
        if (nonJokers.length !== cards.length) return false;
        
        const counts = this.getCardCounts(cards);
        const values = Object.keys(counts).map(Number).sort((a, b) => a - b);
        
        // All cards must appear exactly expectedCount times
        if (!values.every(value => counts[value] === expectedCount)) {
            return false;
        }
        
        // Check if values are consecutive and don't include A(14) or 2(15)
        for (let i = 0; i < values.length; i++) {
            if (values[i] === 14 || values[i] === 15) return false; // A or 2 not allowed
            
            if (i > 0 && values[i] !== values[i-1] + 1) {
                return false; // Not consecutive
            }
        }
        
        const sequenceType = expectedCount === 1 ? 'sequence' : 
                           expectedCount === 2 ? 'pair_sequence' : 'triplet_sequence';
        
        return { 
            type: sequenceType, 
            rank: values[values.length - 1], // Highest card in sequence
            length: values.length 
        };
    }
    
    // Check if cards form a pair sequence (consecutive pairs)
    isPairSequence(cards) {
        if (cards.length < 6 || cards.length % 2 !== 0) return false;
        
        return this.isSequence(cards, 2);
    }
    
    // Check if cards form a triplet sequence (consecutive three-of-a-kinds)
    isTripletSequence(cards) {
        if (cards.length < 6 || cards.length % 3 !== 0) return false;
        
        return this.isSequence(cards, 3);
    }
    
    // Check for complex combinations (triplet sequence with attachments)
    isComplexCombination(cards) {
        // This is for more advanced combinations like airplane with wings
        // For now, we'll keep it simple and return false
        // This can be expanded later for full Fight the Landlord rules
        return false;
    }
    
    // Helper function to count cards by value
    getCardCounts(cards) {
        const counts = {};
        cards.forEach(card => {
            counts[card.value] = (counts[card.value] || 0) + 1;
        });
        return counts;
    }
    
    // Enhanced card comparison for Fight the Landlord combinations
    canBeatLastPlay(cards) {
        const lastPlay = this.lastPlayedCards;
        if (lastPlay.length === 0) return true; // Can always play when no previous play
        
        const currentCombination = this.isValidCardCombination(cards);
        const lastCombination = this.isValidCardCombination(lastPlay);
        
        if (!currentCombination || !lastCombination) return false;
        
        // Rockets beat everything
        if (currentCombination.type === 'rocket') return true;
        if (lastCombination.type === 'rocket') return false;
        
        // Bombs beat everything except rockets and bigger bombs
        if (currentCombination.type === 'bomb') {
            if (lastCombination.type === 'bomb') {
                return currentCombination.rank > lastCombination.rank;
            }
            return lastCombination.type !== 'rocket';
        }
        
        // Regular combinations must match type and be higher rank
        if (currentCombination.type !== lastCombination.type) return false;
        
        // For sequences, must also match length
        if (currentCombination.type.includes('sequence')) {
            if (currentCombination.length !== lastCombination.length) return false;
        }
        
        return currentCombination.rank > lastCombination.rank;
    }

    // Render the area showing played cards
    renderPlayedCards(cards) {
        const container = document.getElementById('played-cards');
        container.innerHTML = '';
        
        if (cards.length > 0) {
            cards.forEach(card => {
                const cardElement = this.createCardElement(card, -1);
                cardElement.style.pointerEvents = 'none';
                cardElement.style.transform = 'scale(0.8)';
                container.appendChild(cardElement);
            });
        } else {
            container.innerHTML = '<p>Waiting for a play...</p>';
        }
    }

    // Move to the next player
    nextPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % 3;
        this.updatePlayerInfo();
    }

    // Update status message
    updateMessage(message) {
        document.querySelector('#message-area p').textContent = message;
    }

    // Play a short sound using Web Audio API
    playTone(freq = 440, duration = 0.15) {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = this.audioCtx;
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.value = 0.1;
        osc.start();
        osc.stop(ctx.currentTime + duration);
    }

    // End the game
    endGame(winner) {
        this.gamePhase = 'ended';
        this.playTone(880, 0.3);
        const modal = document.getElementById('game-over-modal');
        const result = document.getElementById('game-result');
        const message = document.getElementById('game-message');
        
        const winnerPlayer = this.players[winner];
        
        if (winnerPlayer.role === 'landlord') {
            result.textContent = 'Landlord wins!';
            message.textContent = `${winnerPlayer.name} as landlord wins!`;
        } else {
            result.textContent = 'Peasant wins!';
            message.textContent = `${winnerPlayer.name} as peasant wins!`;
        }
        
        modal.classList.remove('hidden');
    }

    // Restart the game
    restartGame() {
        // Reset all game state
        this.deck = [];
        this.players.forEach(player => {
            player.cards = [];
            player.role = null;
        });
        this.landlordCards = [];
        this.currentPlayer = 0;
        this.landlord = -1;
        this.gamePhase = 'playing';
        this.lastPlayedCards = [];
        this.lastPlayer = -1;
        this.selectedCards = [];
        this.passCount = 0;
        
        // Reset base score
        this.baseScore = 1;
        
        // Hide the modal dialog
        document.getElementById('game-over-modal').classList.add('hidden');
        
        // Reinitialize the game
        this.initializeGame();
    }

    // Bind DOM events
    bindEvents() {
        document.getElementById('play-cards').addEventListener('click', () => this.playCards());
        document.getElementById('pass-turn').addEventListener('click', () => this.passTurn());
        document.getElementById('restart-game').addEventListener('click', () => this.restartGame());
        
        // Hint button (simple implementation)
        document.getElementById('hint').addEventListener('click', () => {
            if (this.gamePhase === 'playing' && this.currentPlayer === 0) {
                this.updateMessage('Hint: Choose the right cards to play!');
            }
        });
    }


    // Debug method to check and fix game state
    debugCheckGameState() {
        console.log('Game State Debug:', {
            gamePhase: this.gamePhase,
            landlord: this.landlord,
            currentPlayer: this.currentPlayer,
            playerRoles: this.players.map(p => p.role)
        });

        const landlordPlayer = this.players.find(p => p.role === 'landlord');
        
        // Force show playing buttons if user is landlord and it's playing phase
        if (this.gamePhase === 'playing' || landlordPlayer) {
            console.log('Forcing playing phase and showing buttons...');
            this.gamePhase = 'playing';
            this.currentPlayer = 0; // Make sure it's human player's turn
            this.landlord = 0; // Make sure human is landlord
            this.players[0].role = 'landlord';
            this.players[1].role = 'peasant';
            this.players[2].role = 'peasant';
            
            // Force show the buttons
            const playCardsBtn = document.getElementById('play-cards');
            const passTurnBtn = document.getElementById('pass-turn');
            const hintBtn = document.getElementById('hint');
            
            playCardsBtn.style.display = 'inline-block';
            passTurnBtn.style.display = 'inline-block';
            hintBtn.style.display = 'inline-block';
            
            this.updateMessage('Your turn! Select cards and click PLAY CARDS.');
            this.renderGame();
        }
    }
}
