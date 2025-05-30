# Fight the Landlord Card Game

A web-based implementation of the popular Chinese card game "Fight the Landlord" (Dou Dizhu) featuring beautiful Black Myth Wukong themed artwork.

## 🎮 Game Features

- **Complete Card Game**: Full implementation of Fight the Landlord rules
- **Stunning Visuals**: 120 unique Black Myth Wukong themed card images
- **English Interface**: Fully localized from Chinese to English
- **Interactive Cards**: Hover effects with 30% enlargement and smooth transitions
- **AI Opponents**: Play against computer players with basic AI logic
- **Responsive Design**: Works on desktop and mobile devices
- **Modern Web Tech**: Pure HTML5, CSS3, and JavaScript - no frameworks needed

## 🃏 Card System

### Naming Convention
Cards use a systematic short naming convention:
- **Suits**: `s` (spade), `h` (heart), `c` (club), `d` (diamond)  
- **Ranks**: `a` (ace), `2-9`, `t` (10), `j` (jack), `q` (queen), `k` (king)
- **Jokers**: `jr` (red joker), `jb` (black joker)

Examples: `ht.png` (Hearts 10), `cq.png` (Clubs Queen), `sa.png` (Spades Ace)

### Current Implementation
- 7 cards with short names implemented
- 113 cards with descriptive long names
- All cards feature unique Black Myth Wukong artwork
- 1024x1536 resolution for crisp display

## 🚀 Getting Started

### Quick Start
1. Clone this repository
2. Open `index.html` in any modern web browser
3. Start playing immediately - no build process required!

### For Development
```bash
git clone https://github.com/yourusername/fight-the-landlord-game.git
cd fight-the-landlord-game
# Open index.html in your browser or serve with a local server
```

### Live Demo
You can play the game immediately by opening `index.html` in any modern web browser.

## 📁 Project Structure

```
├── index.html          # Main game interface
├── game.js             # Game logic and card management
├── main.js             # Game initialization
├── style.css           # Styling and hover effects
├── images.json         # Card image mapping reference
├── .gitignore          # Excludes large image files
├── task.md             # Development progress tracking
└── README.md           # This file
```

## 🎨 Visual Features

### Card Interactions
- **Hover Effects**: Cards enlarge 30% on mouse hover
- **Selection**: Golden border highlights for selected cards
- **Smooth Transitions**: 0.3s ease animations for all interactions
- **Z-Index Management**: Hovering cards appear above others

### Responsive Design
- **Desktop**: Cards at 80x112px for optimal visibility
- **Mobile**: Automatically scales to 60x84px
- **Layout**: Flexbox-based responsive card arrangements

## 🃏 Game Rules

Fight the Landlord is played with 3 players using a 54-card deck (including 2 jokers):

1. **Card Distribution**: Each player gets 17 cards, 3 cards remain as "landlord cards"
2. **Landlord Selection**: Players bid to become the landlord
3. **Landlord Advantage**: Gets the 3 extra cards (20 total)
4. **Victory Conditions**: 
   - Landlord wins by playing all cards first
   - Farmers win if either plays all cards first

### Card Rankings (Low to High)
`3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A, 2, Small Joker, Big Joker`

## 🛠 Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: CSS Grid, Flexbox, CSS Transforms
- **Images**: PNG format, optimized for web
- **No Dependencies**: Pure web technologies, no build process

### Browser Compatibility
- Chrome/Edge 60+
- Firefox 55+
- Safari 12+
- Mobile browsers with ES6 support

### Performance
- Optimized image loading
- Efficient card rendering
- Smooth 60fps animations
- Minimal DOM manipulation

## 🖼 Image Assets

**Note**: This repository excludes the 120 card images (excluded via `.gitignore`) to keep the repository lightweight. 

### For Full Game Experience:
You'll need to:
1. Host card images on external services (CloudFlare, AWS S3, GitHub Pages, etc.)
2. Update image paths in `game.js`
3. Or download images locally and update `.gitignore`

### Image Reference:
- All image names and mappings are documented in `images.json`
- Short name mapping system ready for implementation
- Fallback to text-only cards if images unavailable

## 🎯 Game Status

### ✅ Completed Features
- Full English interface translation
- Short card naming system (7 cards implemented)
- Enhanced hover effects (30% enlargement)
- Responsive card sizing
- Basic AI opponent logic
- Complete game rule implementation

### 🔄 Future Enhancements
- Complete deck with all 52 short-named cards
- Advanced AI strategies
- Multiplayer network support
- Card animation effects
- Sound effects
- Score tracking system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎨 Artwork Credits

Card artwork features characters and themes from Black Myth Wukong, created for educational and entertainment purposes.

## 🎮 Play Now!

Ready to challenge the computer opponents? Open `index.html` and start your Fight the Landlord adventure!

---

**Star ⭐ this repository if you enjoyed the game!** 