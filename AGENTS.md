# Repository Guide

This project implements the Fight the Landlord card game using Node.js and vanilla web technologies.

## File Structure

```
/                # project root
├── index.html   # main HTML interface
├── server.js    # development server
├── setup.sh     # install script and test runner
├── main.js      # game initialization
├── game.js      # game logic
├── css/         # modular CSS files
├── images/      # card images and assets
├── tests/       # automated tests
├── dragon_tests/# dragon viewer test pages
├── simple_version/ # simplified HTML versions
├── README.md    # project documentation
└── task.md      # task log
```

### CSS Modules
- `css/style.css` imports all other CSS modules.
- `css/variables.css` defines color system and responsive variables.
- `css/layout.css`, `css/players.css`, `css/cards.css`, `css/ui-components.css`, and `css/responsive.css` provide layout, card styling, UI components and responsive rules.

## Setup

1. Install [Node.js](https://nodejs.org/) version 20 or newer.
2. Run `./setup.sh` to install dependencies and execute tests.
3. Start the development server with `npm start`.
4. Run `npm test` separately to re-run the test suite.

The `setup.sh` script automatically checks the installed Node version and will exit if it is below the required major version.

