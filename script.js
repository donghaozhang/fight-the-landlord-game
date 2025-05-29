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
        this.gamePhase = 'calling'; // calling, playing, ended
        this.lastPlayedCards = [];
        this.lastPlayer = -1;
        this.selectedCards = [];
        this.passCount = 0;
        this.cardImages = this.initializeCardImages();
        
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
        this.updateMessage('Game started, please call landlord!');
    }

    // Create deck
    createDeck() {
        const suits = ['♠', '♥', '♣', '♦'];
        const ranks = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];
        
        this.deck = [];
        
        // Create normal cards
        for (let suit of suits) {
            for (let rank of ranks) {
                this.deck.push({
                    suit: suit,
                    rank: rank,
                    value: this.getCardValue(rank),
                    color: (suit === '♥' || suit === '♦') ? 'red' : 'black'
                });
            }
        }
        
        // Add jokers
        this.deck.push({ suit: '', rank: 'Small Joker', value: 14, color: 'black' });
        this.deck.push({ suit: '', rank: 'Big Joker', value: 15, color: 'red' });
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

    // Deal cards
    dealCards() {
        // Deal 17 cards to each player
        for (let i = 0; i < 17; i++) {
            for (let j = 0; j < 3; j++) {
                this.players[j].cards.push(this.deck.pop());
            }
        }
        
        // Remaining 3 cards as landlord cards
        this.landlordCards = this.deck.splice(0, 3);
        
        // Sort each player's cards
        this.players.forEach(player => {
            this.sortCards(player.cards);
        });
    }

    // Get card value
    getCardValue(rank) {
        const values = {
            '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
            'J': 11, 'Q': 12, 'K': 13, 'A': 14, '2': 15
        };
        return values[rank] || 0;
    }

    // Sort cards
    sortCards(cards) {
        cards.sort((a, b) => {
            if (a.value !== b.value) {
                return a.value - b.value;
            }
            return a.suit.localeCompare(b.suit);
        });
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

    // Render computer cards
    renderComputerCards(playerIndex, containerId) {
        const container = document.querySelector(`#${containerId} .player-cards`);
        container.innerHTML = '';
        
        const cardCount = this.players[playerIndex].cards.length;
        for (let i = 0; i < Math.min(cardCount, 10); i++) {
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            cardBack.textContent = 'Card';
            container.appendChild(cardBack);
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
            playerElement.classList.remove('landlord', 'farmer');
            if (player.role === 'landlord') {
                playerElement.classList.add('landlord');
            } else if (player.role === 'farmer') {
                playerElement.classList.add('farmer');
            }
        });
        
        document.getElementById('current-player').textContent = `Current player: ${this.players[this.currentPlayer].name}`;
        document.getElementById('remaining-cards').textContent = `Remaining cards: ${this.deck.length}`;
    }

    // Update game controls
    updateGameControls() {
        const callLandlordBtn = document.getElementById('call-landlord');
        const passLandlordBtn = document.getElementById('pass-landlord');
        const playCardsBtn = document.getElementById('play-cards');
        const passTurnBtn = document.getElementById('pass-turn');
        
        if (this.gamePhase === 'calling') {
            callLandlordBtn.style.display = this.currentPlayer === 0 ? 'inline-block' : 'none';
            passLandlordBtn.style.display = this.currentPlayer === 0 ? 'inline-block' : 'none';
            playCardsBtn.style.display = 'none';
            passTurnBtn.style.display = 'none';
        } else if (this.gamePhase === 'playing') {
            callLandlordBtn.style.display = 'none';
            passLandlordBtn.style.display = 'none';
            playCardsBtn.style.display = this.currentPlayer === 0 ? 'inline-block' : 'none';
            passTurnBtn.style.display = this.currentPlayer === 0 ? 'inline-block' : 'none';
            
            playCardsBtn.disabled = this.selectedCards.length === 0 || !this.isValidPlay();
            passTurnBtn.disabled = this.lastPlayedCards.length === 0 || this.lastPlayer === this.currentPlayer;
        }
    }

    // Call landlord
    callLandlord() {
        this.landlord = this.currentPlayer;
        this.players[this.currentPlayer].role = 'landlord';
        
        // Other players become farmers
        this.players.forEach((player, index) => {
            if (index !== this.landlord) {
                player.role = 'farmer';
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
        
        // 简单AI逻辑
        if (this.lastPlayedCards.length === 0) {
            // 自由出牌，出最小的单牌
            const cardsToPlay = [player.cards[0]];
            this.aiPlayCards(cardsToPlay);
        } else {
            // 尝试跟牌
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
        if (this.lastPlayedCards.length === 1) {
            // 单牌
            const validCards = cards.filter(card => card.value > this.lastPlayedCards[0].value);
            return validCards.length > 0 ? [validCards[0]] : [];
        }
        // 简化处理，只处理单牌
        return [];
    }

    // 检查是否是有效出牌
    isValidPlay() {
        if (this.selectedCards.length === 0) return false;
        
        const selectedCardObjects = this.selectedCards.map(index => this.players[0].cards[index]);
        
        if (this.lastPlayedCards.length === 0) {
            // 自由出牌，任何组合都可以
            return this.isValidCardCombination(selectedCardObjects);
        }
        
        // 必须出相同类型且更大的牌
        return this.canBeatLastPlay(selectedCardObjects);
    }

    // 检查牌型组合是否有效
    isValidCardCombination(cards) {
        if (cards.length === 1) return true; // 单牌
        if (cards.length === 2) {
            // 对子
            return cards[0].value === cards[1].value;
        }
        if (cards.length === 3) {
            // 三张
            return cards[0].value === cards[1].value && cards[1].value === cards[2].value;
        }
        // 简化处理，其他牌型暂不支持
        return false;
    }

    // 检查是否能压过上家的牌
    canBeatLastPlay(cards) {
        if (cards.length !== this.lastPlayedCards.length) return false;
        
        if (cards.length === 1) {
            // 单牌
            return cards[0].value > this.lastPlayedCards[0].value;
        }
        
        if (cards.length === 2) {
            // 对子
            return cards[0].value === cards[1].value && 
                   cards[0].value > this.lastPlayedCards[0].value;
        }
        
        if (cards.length === 3) {
            // 三张
            return cards[0].value === cards[1].value && 
                   cards[1].value === cards[2].value &&
                   cards[0].value > this.lastPlayedCards[0].value;
        }
        
        return false;
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
            result.textContent = 'Farmer wins!';
            message.textContent = `${winnerPlayer.name} as farmer wins!`;
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
        this.gamePhase = 'calling';
        this.lastPlayedCards = [];
        this.lastPlayer = -1;
        this.selectedCards = [];
        this.passCount = 0;
        
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
            }
        });
    }
}

// 游戏初始化
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new DouDiZhuGame();
});