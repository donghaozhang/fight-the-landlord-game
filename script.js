// Fight the Landlord Game Class
class DouDiZhuGame {
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
        this.gamePhase = 'bidding'; // bidding, playing, ended
        this.lastPlayedCards = [];
        this.lastPlayer = -1;
        this.selectedCards = [];
        this.passCount = 0;
        this.cardImages = this.initializeCardImages();
        
        // Bidding system properties
        this.currentBidder = 0; // Start with player 0
        this.currentBid = 0; // Current highest bid (0 = no bids yet)
        this.currentBidder = -1; // Who made the current bid
        this.biddingPasses = 0; // Count of consecutive passes
        this.baseScore = 0; // Base score for the game
        
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
        this.renderGame();
        this.startBidding();
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
                playerElement.classList.add('peasant');
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
        const callLandlordBtn = document.getElementById('call-landlord');
        const passLandlordBtn = document.getElementById('pass-landlord');
        const playCardsBtn = document.getElementById('play-cards');
        const passTurnBtn = document.getElementById('pass-turn');
        const hintBtn = document.getElementById('hint');
        
        // Hide all buttons first
        callLandlordBtn.style.display = 'none';
        passLandlordBtn.style.display = 'none';
        playCardsBtn.style.display = 'none';
        passTurnBtn.style.display = 'none';
        hintBtn.style.display = 'none';
        
        // Remove all bidding buttons
        document.querySelectorAll('.bid-button').forEach(btn => btn.remove());
        
        if (this.gamePhase === 'bidding') {
            if (this.currentBidder === 0) {
                // Show bidding buttons for human player
                this.showBiddingButtons();
            }
        } else if (this.gamePhase === 'playing') {
            if (this.currentPlayer === 0) {
                playCardsBtn.style.display = 'inline-block';
                passTurnBtn.style.display = 'inline-block';
                hintBtn.style.display = 'inline-block';
            }
        }
    }

    // Show bidding buttons with dynamic options
    showBiddingButtons() {
        const container = document.querySelector('.game-controls');
        
        // Remove existing bidding buttons
        container.querySelectorAll('.bid-button').forEach(btn => btn.remove());
        
        // Add bidding buttons
        for (let i = this.currentBid + 1; i <= 3; i++) {
            const bidBtn = document.createElement('button');
            bidBtn.className = 'btn bid-button';
            bidBtn.textContent = `Bid ${i}`;
            bidBtn.onclick = () => this.makeBid(i);
            container.appendChild(bidBtn);
        }
        
        // Add pass button
        const passBtn = document.createElement('button');
        passBtn.className = 'btn bid-button';
        passBtn.textContent = 'Pass';
        passBtn.onclick = () => this.passBid();
        container.appendChild(passBtn);
    }

    // Call landlord
    callLandlord() {
        this.landlord = this.currentPlayer;
        this.players[this.currentPlayer].role = 'landlord';
        
        // Other players become peasants
        this.players.forEach((player, index) => {
            if (index !== this.landlord) {
                player.role = 'peasant';
            }
        });
        
        // Landlord gets the landlord cards
        this.players[this.landlord].cards.push(...this.landlordCards);
        this.sortCards(this.players[this.landlord].cards);
        
        this.gamePhase = 'playing';
        this.currentPlayer = this.landlord;
        this.lastPlayedCards = [];
        this.lastPlayer = -1;
        
        this.renderGame();
        this.updateMessage(`${this.players[this.landlord].name} is now the landlord!`);
    }

    // Pass on calling landlord
    passLandlord() {
        this.nextPlayer();
        
        // Simple AI: randomly decide whether to call landlord
        if (this.currentPlayer !== 0) {
            setTimeout(() => {
                if (Math.random() < 0.3) {
                    this.callLandlord();
                } else {
                    this.passLandlord();
                }
            }, 1000);
        }
    }

    // 出牌
    playCards() {
        if (this.selectedCards.length === 0 || !this.isValidPlay()) return;
        
        const selectedCardObjects = this.selectedCards.map(index => this.players[0].cards[index]);
        
        // 移除选中的牌
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
        
        // 检查游戏是否结束
        if (this.players[0].cards.length === 0) {
            this.endGame(0);
            return;
        }
        
        this.nextPlayer();
        this.updateMessage(`${this.players[this.lastPlayer].name} played`);
        
        // AI玩家自动出牌
        if (this.currentPlayer !== 0) {
            setTimeout(() => this.aiPlay(), 1500);
        }
    }

    // 不要
    passTurn() {
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
        
        // AI玩家自动决策
        if (this.currentPlayer !== 0) {
            setTimeout(() => this.aiPlay(), 1500);
        }
        
        this.updateGameControls();
    }

    // AI玩家出牌
    aiPlay() {
        const player = this.players[this.currentPlayer];
        
        // 寻找AI可以出的牌
        const validCards = this.findValidAICards(player.cards);
        if (validCards.length > 0) {
            this.aiPlayCards(validCards);
        } else {
            // 不要
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

    // AI出牌
    aiPlayCards(cards) {
        // 从AI玩家手牌中移除这些牌
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
        
        // 检查游戏是否结束
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

    // 寻找AI可以出的牌
    findValidAICards(cards) {
        if (this.lastPlayedCards.length === 0) {
            // 自由出牌，出最小的单牌
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

    // 检查是否是有效出牌
    isValidPlay() {
        if (this.selectedCards.length === 0) return false;
        
        const selectedCardObjects = this.selectedCards.map(index => this.players[0].cards[index]);
        
        // First check if it's a valid card combination
        const combination = this.isValidCardCombination(selectedCardObjects);
        if (!combination) return false;
        
        if (this.lastPlayedCards.length === 0) {
            // 自由出牌，任何有效组合都可以
            return true;
        }
        
        // 必须出相同类型且更大的牌，或者出炸弹/火箭
        return this.canBeatLastPlay(selectedCardObjects);
    }

    // 检查牌型组合是否有效
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

    // 渲染出牌区域
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

    // 下一个玩家
    nextPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % 3;
        this.updatePlayerInfo();
    }

    // 更新消息
    updateMessage(message) {
        document.querySelector('#message-area p').textContent = message;
    }

    // 结束游戏
    endGame(winner) {
        this.gamePhase = 'ended';
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

    // 重新开始游戏
    restartGame() {
        // 重置所有状态
        this.deck = [];
        this.players.forEach(player => {
            player.cards = [];
            player.role = null;
        });
        this.landlordCards = [];
        this.currentPlayer = 0;
        this.landlord = -1;
        this.gamePhase = 'bidding';
        this.lastPlayedCards = [];
        this.lastPlayer = -1;
        this.selectedCards = [];
        this.passCount = 0;
        
        // Reset bidding state
        this.currentBidder = 0;
        this.currentBid = 0;
        this.highestBidder = -1;
        this.biddingPasses = 0;
        this.baseScore = 0;
        
        // Remove dynamic bidding buttons
        document.querySelectorAll('.bid-button').forEach(btn => btn.remove());
        
        // 隐藏模态框
        document.getElementById('game-over-modal').classList.add('hidden');
        
        // 重新初始化游戏
        this.initializeGame();
    }

    // 绑定事件
    bindEvents() {
        document.getElementById('call-landlord').addEventListener('click', () => this.callLandlord());
        document.getElementById('pass-landlord').addEventListener('click', () => this.passLandlord());
        document.getElementById('play-cards').addEventListener('click', () => this.playCards());
        document.getElementById('pass-turn').addEventListener('click', () => this.passTurn());
        document.getElementById('restart-game').addEventListener('click', () => this.restartGame());
        
        // 提示按钮（简单实现）
        document.getElementById('hint').addEventListener('click', () => {
            if (this.gamePhase === 'playing' && this.currentPlayer === 0) {
                this.updateMessage('Hint: Choose the right cards to play!');
            } else if (this.gamePhase === 'bidding') {
                // Debug: Force transition to playing if user is already landlord
                this.debugCheckGameState();
            }
        });
    }

    // Start bidding phase
    startBidding() {
        this.gamePhase = 'bidding';
        this.currentBidder = 0;
        this.currentBid = 0;
        this.highestBidder = -1;
        this.biddingPasses = 0;
        this.updateMessage('Bidding phase started. Player 1, please bid or pass.');
        this.updateGameControls();
    }

    // Make a bid
    makeBid(points) {
        if (this.gamePhase !== 'bidding' || points < 1 || points > 3) {
            return false;
        }
        
        // Bid must be higher than current bid
        if (points <= this.currentBid) {
            this.updateMessage(`Bid must be higher than ${this.currentBid}`);
            return false;
        }
        
        this.currentBid = points;
        this.highestBidder = this.currentBidder;
        this.biddingPasses = 0;
        this.baseScore = points;
        
        this.updateMessage(`${this.players[this.currentBidder].name} bids ${points} point(s)`);
        
        // Move to next bidder
        this.nextBidder();
        return true;
    }

    // Pass in bidding
    passBid() {
        if (this.gamePhase !== 'bidding') {
            return false;
        }
        
        this.biddingPasses++;
        this.updateMessage(`${this.players[this.currentBidder].name} passes`);
        
        // Check if bidding should end
        if (this.biddingPasses >= 3 && this.highestBidder === -1) {
            // All players passed, redeal
            this.updateMessage('All players passed. Redealing cards...');
            setTimeout(() => {
                this.restartGame();
            }, 2000);
            return true;
        }
        
        if (this.biddingPasses >= 2 && this.highestBidder !== -1) {
            // Two passes after a bid, bidding ends
            this.endBidding();
            return true;
        }
        
        // Move to next bidder
        this.nextBidder();
        return true;
    }

    // Move to next bidder
    nextBidder() {
        this.currentBidder = (this.currentBidder + 1) % 3;
        
        if (this.currentBidder !== 0) {
            // AI bidding
            setTimeout(() => {
                this.aiBid();
            }, 1000);
        } else {
            this.updateGameControls();
        }
    }

    // AI bidding logic
    aiBid() {
        if (this.gamePhase !== 'bidding') return;
        
        const player = this.players[this.currentBidder];
        const cards = player.cards;
        
        // Simple AI bidding strategy based on card strength
        const strength = this.evaluateHandStrength(cards);
        const bidProbability = this.calculateBidProbability(strength, this.currentBid);
        
        const shouldBid = Math.random() < bidProbability;
        
        if (shouldBid && this.currentBid < 3) {
            const bidAmount = this.currentBid + 1;
            this.makeBid(bidAmount);
        } else {
            this.passBid();
        }
    }

    // Evaluate hand strength for AI bidding
    evaluateHandStrength(cards) {
        let strength = 0;
        const cardCounts = {};
        
        // Count cards by rank
        cards.forEach(card => {
            cardCounts[card.rank] = (cardCounts[card.rank] || 0) + 1;
        });
        
        // Evaluate strength based on:
        // - High cards (A, 2, Jokers)
        // - Pairs, triplets, bombs
        // - Jokers
        cards.forEach(card => {
            if (card.rank === 'Big Joker') strength += 15;
            else if (card.rank === 'Small Joker') strength += 12;
            else if (card.rank === '2') strength += 8;
            else if (card.rank === 'A') strength += 6;
            else if (card.rank === 'K') strength += 4;
            else if (card.rank === 'Q') strength += 3;
            else if (card.rank === 'J') strength += 2;
            else strength += 1;
        });
        
        // Bonus for multiple cards of same rank
        Object.values(cardCounts).forEach(count => {
            if (count === 2) strength += 3; // Pair
            else if (count === 3) strength += 8; // Triplet
            else if (count === 4) strength += 20; // Bomb
        });
        
        return strength;
    }

    // Calculate bidding probability based on hand strength
    calculateBidProbability(strength, currentBid) {
        // Adjust thresholds based on current bid
        const baseThreshold = 60 + (currentBid * 20);
        
        if (strength > baseThreshold + 40) return 0.8;
        if (strength > baseThreshold + 20) return 0.6;
        if (strength > baseThreshold) return 0.4;
        if (strength > baseThreshold - 20) return 0.2;
        return 0.1;
    }

    // End bidding phase and start game
    endBidding() {
        if (this.highestBidder === -1) {
            this.updateMessage('No valid bids. Restarting...');
            setTimeout(() => this.restartGame(), 2000);
            return;
        }
        
        // Set landlord
        this.landlord = this.highestBidder;
        this.players[this.landlord].role = 'landlord';
        
        // Set peasants
        for (let i = 0; i < 3; i++) {
            if (i !== this.landlord) {
                this.players[i].role = 'peasant';
            }
        }
        
        // Give landlord bonus cards
        this.landlordCards.forEach(card => {
            this.players[this.landlord].cards.push(card);
        });
        this.landlordCards = []; // Clear the bonus cards
        
        // Sort landlord's cards after adding bonus cards
        this.sortCards(this.players[this.landlord].cards);
        
        // Start playing phase
        this.gamePhase = 'playing';
        this.currentPlayer = this.landlord; // Landlord plays first
        
        this.updateMessage(`${this.players[this.landlord].name} is the landlord with ${this.baseScore} point(s). Game starts!`);
        this.renderGame();
        this.updateGameControls();
        
        // If landlord is AI, start their turn
        if (this.landlord !== 0) {
            setTimeout(() => this.aiPlay(), 1500);
        }
    }

    // Debug method to check and fix game state
    debugCheckGameState() {
        console.log('Game State Debug:', {
            gamePhase: this.gamePhase,
            landlord: this.landlord,
            currentPlayer: this.currentPlayer,
            currentBidder: this.currentBidder,
            highestBidder: this.highestBidder,
            playerRoles: this.players.map(p => p.role)
        });
        
        // If a player is already landlord but game is in bidding phase, force transition
        const landlordPlayer = this.players.find(p => p.role === 'landlord');
        if (landlordPlayer && this.gamePhase === 'bidding') {
            console.log('Forcing transition to playing phase...');
            this.landlord = this.players.indexOf(landlordPlayer);
            this.gamePhase = 'playing';
            this.currentPlayer = this.landlord;
            this.updateMessage(`${landlordPlayer.name} is the landlord. Game starts!`);
            this.updateGameControls();
            this.renderGame();
        }
        
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
            
            // Remove any lingering bidding buttons
            document.querySelectorAll('.bid-button').forEach(btn => btn.remove());
            
            this.updateMessage('Your turn! Select cards and click PLAY CARDS.');
            this.renderGame();
        }
    }
}

// 游戏初始化
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new DouDiZhuGame();
});