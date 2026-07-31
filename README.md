# 2048

A browser-based clone of the classic 2048 puzzle game, built using plain **HTML, CSS, and JavaScript** — no frameworks or libraries.

[![2048 Game Screenshot](./screenshot.png)](https://github.com/jaikaran109/2048-Game)

## How to Play

- Use your **arrow keys** (↑ ↓ ← →) to slide all tiles in that direction.
- When two tiles with the same number touch, they **merge into one** (e.g. 2 + 2 = 4).
- After every move, a new tile (2 or 4) appears in a random empty cell.
- Keep merging to reach the **2048** tile.
- The game ends when the board is full and no more merges are possible.

## Features

- 4x4 grid with smooth tile logic (slide + merge in all 4 directions)
- Score tracking, with **Best Score** saved across sessions using `localStorage`
- Tile colors change dynamically based on their value (2, 4, 8 ... up to 2048), matching the original game's color scheme
- "New Game" button to reset the board at any time
- Responsive layout for mobile screens

## Project Structure

```
├── index.html        # Game markup (grid, score, instructions)
├── style.css          # Layout, tile styling, and tile colors
├── app.js             # Game logic (movement, merging, scoring, rendering)
└── screenshot.png      # Preview image used in this README
```

## Tech Stack

- **HTML** — page structure and the 4x4 grid of cells
- **CSS** — grid layout, tile colors per value, responsive design
- **JavaScript** — game state (2D array), move/merge logic, keyboard input, rendering, and local storage for best score

## Author

Jai Karan Gupta
