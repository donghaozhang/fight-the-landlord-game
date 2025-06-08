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

// Test sortCards ordering
 test('sortCards orders cards by value', async () => {
   const game = await createGame();
   const cards = [
     makeCard(game, 'A', '♠'),
     makeCard(game, '3', '♥'),
     makeCard(game, 'K', '♦')
   ];
   game.sortCards(cards);
   const ranks = cards.map(c => c.rank);
   assert.deepStrictEqual(ranks, ['3', 'K', 'A']);
 });

 // Test isRocket
 test('isRocket identifies both jokers', async () => {
   const game = await createGame();
   const rocket = [makeCard(game, 'Small Joker'), makeCard(game, 'Big Joker')];
   assert.strictEqual(game.isRocket(rocket), true);
   const notRocket = [makeCard(game, 'Small Joker'), makeCard(game, '5', '♠')];
   assert.strictEqual(game.isRocket(notRocket), false);
 });

 // Test three with single and pair
 test('three-with-single and three-with-pair detection', async () => {
   const game = await createGame();
   const tSingle = [
     makeCard(game, '5', '♠'),
     makeCard(game, '5', '♥'),
     makeCard(game, '5', '♦'),
     makeCard(game, '9', '♣')
   ];
   assert.deepStrictEqual(game.isThreeWithSingle(tSingle), {
     type: 'three_single',
     rank: game.getCardValue('5')
   });
   const tPair = [
     makeCard(game, '9', '♠'),
     makeCard(game, '9', '♥'),
     makeCard(game, '9', '♦'),
     makeCard(game, '6', '♠'),
     makeCard(game, '6', '♥')
   ];
   assert.deepStrictEqual(game.isThreeWithPair(tPair), {
     type: 'three_pair',
     rank: game.getCardValue('9')
   });
 });

 // Test sequence helpers
 test('sequence, pair sequence and triplet sequence', async () => {
   const game = await createGame();
   const seq = ['3','4','5','6','7'].map(r => makeCard(game, r));
   assert.deepStrictEqual(game.isSequence(seq, 1), {
     type: 'sequence',
     rank: game.getCardValue('7'),
     length: 5
   });
   const pairSeq = [
     makeCard(game, '4', '♠'), makeCard(game, '4', '♥'),
     makeCard(game, '5', '♠'), makeCard(game, '5', '♦'),
     makeCard(game, '6', '♠'), makeCard(game, '6', '♦')
   ];
   assert.deepStrictEqual(game.isPairSequence(pairSeq), {
     type: 'pair_sequence',
     rank: game.getCardValue('6'),
     length: 3
   });
   const tripletSeq = [
     makeCard(game, '7', '♠'), makeCard(game, '7', '♥'), makeCard(game, '7', '♦'),
     makeCard(game, '8', '♠'), makeCard(game, '8', '♥'), makeCard(game, '8', '♦')
   ];
   assert.deepStrictEqual(game.isTripletSequence(tripletSeq), {
     type: 'triplet_sequence',
     rank: game.getCardValue('8'),
     length: 2
   });
 });

 // Test getCardCounts
 test('getCardCounts tallies values correctly', async () => {
   const game = await createGame();
   const cards = [
     makeCard(game, 'A', '♠'),
     makeCard(game, 'A', '♥'),
     makeCard(game, 'K', '♦')
   ];
   const counts = game.getCardCounts(cards);
   assert.strictEqual(counts[game.getCardValue('A')], 2);
   assert.strictEqual(counts[game.getCardValue('K')], 1);
 });

// Test getCardImageKey mapping
 test('getCardImageKey returns correct keys', async () => {
   const game = await createGame();
   const spadeA = makeCard(game, 'A', '♠');
   const heart10 = makeCard(game, '10', '♥');
   const bigJoker = makeCard(game, 'Big Joker');
   assert.strictEqual(game.getCardImageKey(spadeA), 'spade_a');
   assert.strictEqual(game.getCardImageKey(heart10), 'heart_10');
   assert.strictEqual(game.getCardImageKey(bigJoker), 'joker_big');
 });

 // Test assignLandlord basic behavior
 test('assignLandlord sets roles and deals cards', async () => {
   const game = await createGame();
   game.updateMessage = () => {};
   game.landlordCards = [
     makeCard(game, '3', '♠'),
     makeCard(game, '4', '♠'),
     makeCard(game, '5', '♠')
   ];
   game.players.forEach(p => { p.cards = []; });
   game.assignLandlord();
   assert.strictEqual(game.landlord, 0);
   assert.strictEqual(game.players[0].role, 'landlord');
   assert.strictEqual(game.players[1].role, 'peasant');
   assert.strictEqual(game.players[0].cards.length, 3);
   assert.strictEqual(game.landlordCards.length, 0);
   assert.strictEqual(game.currentPlayer, 0);
 });

 // Test isComplexCombination always returns false
 test('isComplexCombination currently returns false', async () => {
   const game = await createGame();
   const cards = [
     makeCard(game, '3', '♠'), makeCard(game, '3', '♥'), makeCard(game, '3', '♦'),
     makeCard(game, '4', '♠'), makeCard(game, '4', '♥'), makeCard(game, '4', '♦')
   ];
   assert.strictEqual(game.isComplexCombination(cards), false);
 });
