# Fight the Landlord Card Game

A web-based implementation of the popular Chinese card game "Fight the Landlord" (Dou Dizhu) featuring beautiful Black Myth Wukong themed artwork and a modern tech-themed interface.

## 🎮 Game Features

- **Complete Card Game**: Full implementation of Fight the Landlord rules with bidding system
- **Stunning Visuals**: Black Myth Wukong themed background with tech-grid overlay
- **Modern Interface**: Dark tech-themed UI with neon effects and glassmorphism
- **English Interface**: Fully localized from Chinese to English
- **Interactive Cards**: Overlapping card hands with hover effects and smooth transitions
- **AI Opponents**: Play against computer players with strategic AI logic
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modular Architecture**: Clean, maintainable CSS structure with 6 specialized modules
- **Sound Effects**: Minimal beeps for plays and wins

## 🃏 Card System & Game Rules

### Card Hierarchy (Low to High)
`3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A, 2, Small Joker, Big Joker`

### Game Flow
1. **Bidding Phase**: Players bid 1-3 points or pass to become landlord
2. **Card Distribution**: Each player gets 17 cards, landlord gets 3 bonus cards (20 total)
3. **Victory Conditions**: 
   - Landlord wins by playing all cards first
   - Peasants win if either plays all cards first

### Valid Card Combinations
- Singles, pairs, three-of-a-kind
- Three + single/pair combinations
- Sequences (5+ consecutive cards)
- Pair sequences (3+ consecutive pairs)
- Triplet sequences (2+ consecutive triplets)
- Bombs (four of a kind) - beats any non-rocket
- Rockets (both jokers) - beats everything

### Card Naming Convention
Cards use a systematic short naming convention:
- **Suits**: `s` (spade), `h` (heart), `c` (club), `d` (diamond)  
- **Ranks**: `a` (ace), `2-9`, `t` (10), `j` (jack), `q` (queen), `k` (king)
- **Jokers**: `jr` (red joker), `jb` (black joker)

Examples: `ht.png` (Hearts 10), `cq.png` (Clubs Queen), `sa.png` (Spades Ace)

## 🚀 Getting Started

### Quick Start
1. Clone this repository
2. Install [Node.js](https://nodejs.org/) if you don't have it
3. Run `npm start` to launch the local development server
4. Open `http://localhost:8080` in your browser to play the game

### For Development
```bash
git clone https://github.com/donghaozhang/fight-the-landlord-game.git
cd fight-the-landlord-game
npm start
```

### Running Tests
Use Node.js 20+ for the built-in test runner.
```bash
npm test
```

### Live Demo
You can play the game immediately by opening `index.html` in any modern web browser.

## 📁 Project Structure

```
├── index.html              # Main game interface
├── game.js                 # Game logic and card management
├── main.js                 # Game initialization
├── server.js               # Development server
├── package.json            # npm scripts and metadata
├── css/                    # Modular CSS architecture
│   ├── style.css           # Main CSS file (imports all modules)
│   ├── variables.css       # CSS custom properties and base styles
│   ├── layout.css          # Main layout containers and grid system
│   ├── players.css         # Player containers and role styling
│   ├── cards.css           # Card styles and overlapping effects
│   ├── ui-components.css   # Buttons, modals, and interactive elements
│   └── responsive.css      # Media queries and responsive design
├── images/                 # Game assets (card images, background)
├── tests/                  # Automated tests
├── archive/                # Development history and backups
├── simple_version/         # Simplified version for reference
├── .gitignore              # Repository configuration
├── task.md                 # Development progress tracking
└── README.md               # This file
```

## 🎨 Visual Features & Design

### Modular CSS Architecture
The styling system is built with a clean, maintainable modular structure:

- **`css/variables.css`** (97 lines): CSS custom properties, color system, responsive variables
- **`css/layout.css`** (162 lines): Main containers, header, game grid, center area
- **`css/players.css`** (408 lines): Player positioning, role styling, landlord/peasant themes
- **`css/cards.css`** (330 lines): Card styling, overlapping effects, hover animations
- **`css/ui-components.css`** (222 lines): Buttons, modals, messages, interactive controls
- **`css/responsive.css`** (393 lines): Mobile-first responsive design across all breakpoints

### Tech-Themed Visual Design
- **Background**: Black Myth Wukong artwork with subtle tech grid overlay
- **Color Scheme**: Dark blue gradient backgrounds with cyan/blue neon accents
- **Effects**: Glassmorphism blur, glow effects, shimmer animations
- **Typography**: Enhanced text shadows for readability over complex backgrounds

### Card Interactions
- **Overlapping Cards**: Natural card hand appearance with mathematical positioning
- **Hover Effects**: 20-30% enlargement with smooth 0.3s transitions
- **Selection**: Golden border highlights with enhanced glow effects
- **Z-Index Management**: Systematic layering prevents UI blocking

### Responsive Design Features
- **Mobile-First**: Optimized for 320px+ with touch-friendly interactions
- **Breakpoints**: 5 distinct responsive breakpoints (320px, 481px, 769px, 1025px, 1400px)
- **Fluid Typography**: Using clamp() functions for scalable text
- **Performance**: Reduced animations on mobile for better performance

## 🛠 Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Custom Properties, Backdrop Filters
- **Images**: PNG format, optimized for web, external hosting ready
- **Server**: Node.js HTTP server for development
- **No Dependencies**: Pure web technologies, no build process required

### Browser Compatibility
- Chrome/Edge 60+ (full CSS Grid and backdrop-filter support)
- Firefox 55+ (with backdrop-filter support)
- Safari 12+ (full modern CSS support)
- Mobile browsers with ES6 and modern CSS support

### Performance Optimizations
- Modular CSS loading for better caching
- Efficient card rendering with transform3d
- Smooth 60fps animations with CSS transforms
- Minimal DOM manipulation during gameplay
- Reduced motion support for accessibility

## 🖼 Image Assets

The repository includes all necessary image assets:
- **Card Images**: 54 card images using short naming convention (e.g., `sa.png`, `ht.png`)
- **Background**: `images/wukong.jpg` for Black Myth Wukong theme
- **Audio**: `images/wukong.mp3` for background music

### Image Reference:
- Card filenames follow the short naming scheme (e.g., `sa.png` for spade ace)
- Jokers: `jr.png` (red joker), `jb.png` (black joker)
- Background assets integrated into tech-themed interface

## 🎯 Game Status

### ✅ Completed Features
- **Core Gameplay**: Complete Fight the Landlord implementation with bidding
- **Visual Design**: Tech-themed dark interface with Wukong background
- **Modular CSS**: Clean 6-module architecture for maintainability
- **Card System**: 54-card deck with proper rankings and combinations
- **Responsive Design**: Mobile-first approach with 5 breakpoints
- **AI Logic**: Strategic computer players with bidding and card play
- **Overlapping Cards**: Natural card hand appearance for all players
- **Enhanced UI**: Modern buttons, modals, and interactive elements
- **Image Assets**: Complete card set and background assets included
- **CSS Organization**: All styling files organized in dedicated `css/` folder

### 🚀 Future Enhancements
- Display full card hands (remove 15-card limit)
- Enhanced score system with multipliers
- Advanced card combinations (airplane with wings)
- Online multiplayer support
- Advanced AI strategies with difficulty levels
- Card animation effects during play
- Comprehensive score tracking system
- Tournament mode
- Additional card themes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the modular CSS structure in the `css/` folder when adding styles
- Test across all responsive breakpoints
- Maintain the tech-themed visual consistency
- Ensure accessibility standards (WCAG guidelines)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎨 Artwork Credits

Background artwork features characters and themes from Black Myth Wukong, created for educational and entertainment purposes.

## 🎮 Play Now!

Ready to challenge the computer opponents in this beautifully themed Fight the Landlord game? Open `index.html` and start your adventure!

---

**Star ⭐ this repository if you enjoyed the game!** 