# Modern Tic Tac Toe

A classic **tic-tac-toe** game that runs in the browser with no build step or install. The UI supports three color themes and light/dark mode; scores are stored in the browser.

## Features

- **Player vs Player (PvP):** Take turns as X and O on the same device.
- **Player vs Computer (PvC):** You play as X; O is the computer. Simple AI: win if possible, block the player, take the center if free, otherwise pick a random empty cell.
- **Themes:** Neon, Pastel, and Minimal — your choice is saved in `localStorage`.
- **Light / dark mode:** Toggle with the sun/moon control; preference is persisted.
- **Scoreboard:** Wins for X, draws, and wins for O; use **Reset Score** to clear totals.
- **New Game:** Clears the board without changing the score.
- **Win highlight:** The winning line is emphasized; a short result message and **Play Again** are shown.

## Tech stack

- HTML5, CSS3 (custom properties and animations)
- Vanilla JavaScript (no bundler or package manager required)
- Google Fonts: Poppins, Orbitron, Space Mono

## How to run

1. Open `index.html` in your default browser (double-click in this folder), **or**
2. Optionally serve the project root with a static server, for example:

   ```bash
   npx --yes serve .
   ```

   Then open the URL shown in the terminal.

An internet connection is only needed to load fonts; game logic works fully offline.

## Project layout

| File         | Role                                      |
| ------------ | ----------------------------------------- |
| `index.html` | Page structure and UI hooks               |
| `style.css`  | Themes, layout, dark mode styles          |
| `script.js`  | Game state, computer moves, `localStorage` |

## Persistent data

The browser stores the following in `localStorage`:

- `theme` — selected theme
- `darkMode` — whether dark mode is on
- `scores` — X wins, O wins, and draws

Clearing site data for this origin resets these preferences.

<img width="1047" height="617" alt="Ekran görüntüsü 2026-04-19 165256" src="https://github.com/user-attachments/assets/f073588c-5c63-4bfe-86e2-c5499becc5cc" />

## License

If no license is specified for this repository, clarify terms of use with the project owner.
