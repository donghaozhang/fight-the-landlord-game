const assert = require('node:assert');
const { test } = require('node:test');

async function loadGame() {
  const mod = await import('../game.js');
  return mod.DouDiZhuGame;
}

async function createGame() {
  const Game = await loadGame();
  const game = Object.create(Game.prototype);
  game.players = [
    { name: 'Player 1', cards: [], isHuman: true, role: null },
    { name: 'Computer 1', cards: [], isHuman: false, role: null },
    { name: 'Computer 2', cards: [], isHuman: false, role: null }
  ];
  game.landlordCards = [];
  game.currentPlayer = 0;
  game.landlord = -1;
  game.gamePhase = 'playing';
  game.lastPlayedCards = [];
  game.lastPlayer = -1;
  game.selectedCards = [];
  game.passCount = 0;
  game.baseScore = 1;
  game.cardImages = game.initializeCardImages();
  game.deck = [];
  return game;
}

function makeCard(game, rank, suit = '♠') {
  return {
    rank,
    suit,
    value: game.getCardValue(rank),
    color: (suit === '♥' || suit === '♦') ? 'red' : 'black',
    isJoker: rank.includes('Joker')
  };
}

// Test createDeck
test('createDeck builds a 54 card deck', async () => {
  const game = await createGame();
  game.createDeck();
  assert.strictEqual(game.deck.length, 54);
  const ranks = game.deck.map(c => c.rank);
  assert(ranks.includes('Small Joker'));
  assert(ranks.includes('Big Joker'));
});

// Test shuffleDeck keeps same cards
test('shuffleDeck keeps card count and cards', async () => {
  const game = await createGame();
  game.createDeck();
  const original = game.deck.map(c => c.rank + c.suit);
  const origSorted = [...original].sort().join(',');
  const origRandom = Math.random;
  Math.random = () => 0.5;
  game.shuffleDeck();
  Math.random = origRandom;
  assert.strictEqual(game.deck.length, 54);
  const shuffled = game.deck.map(c => c.rank + c.suit);
  const shuffledSorted = [...shuffled].sort().join(',');
  assert.strictEqual(shuffledSorted, origSorted);
  assert.notDeepStrictEqual(shuffled, original);
});

// Test dealCards
test('dealCards distributes cards correctly', async () => {
  const game = await createGame();
  game.createDeck();
  game.shuffleDeck();
  game.dealCards();
  assert.strictEqual(game.players[0].cards.length, 17);
  assert.strictEqual(game.players[1].cards.length, 17);
  assert.strictEqual(game.players[2].cards.length, 17);
  assert.strictEqual(game.landlordCards.length, 3);
  assert.strictEqual(game.deck.length, 0);
});

// Test getCardValue and comparisons
test('getCardValue and card comparison helpers', async () => {
  const game = await createGame();
  assert.strictEqual(game.getCardValue('3'), 3);
  assert.strictEqual(game.getCardValue('A'), 14);
  assert.strictEqual(game.getCardValue('Small Joker'), 16);
  const c3 = makeCard(game, '3');
  const c4 = makeCard(game, '4');
  assert.ok(game.compareCards(c3, c4) < 0);
  assert.ok(game.isCardHigher(c4, c3));
});

// Test isValidCardCombination
test('isValidCardCombination detects combinations', async () => {
  const game = await createGame();
  const pair = [makeCard(game, '5', '♠'), makeCard(game, '5', '♥')];
  assert.deepStrictEqual(game.isValidCardCombination(pair), {
    type: 'pair',
    rank: game.getCardValue('5')
  });

  const rocket = [makeCard(game, 'Small Joker'), makeCard(game, 'Big Joker')];
  assert.deepStrictEqual(game.isValidCardCombination(rocket), {
    type: 'rocket',
    rank: 1000
  });

  const bomb = [
    makeCard(game, 'Q', '♠'),
    makeCard(game, 'Q', '♥'),
    makeCard(game, 'Q', '♣'),
    makeCard(game, 'Q', '♦')
  ];
  assert.deepStrictEqual(game.isValidCardCombination(bomb), {
    type: 'bomb',
    rank: game.getCardValue('Q')
  });

  const seq = [
    makeCard(game, '3'),
    makeCard(game, '4'),
    makeCard(game, '5'),
    makeCard(game, '6'),
    makeCard(game, '7')
  ];
  const res = game.isValidCardCombination(seq);
  assert.strictEqual(res.type, 'sequence');
  assert.strictEqual(res.rank, game.getCardValue('7'));
  assert.strictEqual(res.length, 5);
});

// Test canBeatLastPlay
test('canBeatLastPlay compares plays correctly', async () => {
  const game = await createGame();
  const pair6 = [makeCard(game, '6', '♠'), makeCard(game, '6', '♥')];
  const pair7 = [makeCard(game, '7', '♠'), makeCard(game, '7', '♥')];
  game.lastPlayedCards = pair6;
  assert.strictEqual(game.canBeatLastPlay(pair7), true);
  const pair5 = [makeCard(game, '5', '♠'), makeCard(game, '5', '♥')];
  assert.strictEqual(game.canBeatLastPlay(pair5), false);
  const rocket = [makeCard(game, 'Small Joker'), makeCard(game, 'Big Joker')];
  assert.strictEqual(game.canBeatLastPlay(rocket), true);
  const bomb = [
    makeCard(game, 'Q', '♠'),
    makeCard(game, 'Q', '♥'),
    makeCard(game, 'Q', '♣'),
    makeCard(game, 'Q', '♦')
  ];
  assert.strictEqual(game.canBeatLastPlay(bomb), true);
});

