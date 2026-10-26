# ABB Tic Tac Toe

A React implementation of the ABB technical assignment: a 3×3 Tic Tac Toe game with two-player and computer modes, move history, undo, and a separate scoreboard.

## 1. Overview

The application supports:

- Two-player local play.
- A deterministic computer opponent.
- Win, draw, and in-progress status detection.
- Winning-cell highlighting.
- Move history with derived move number, row, and column.
- Two-player and computer-mode undo.
- A scoreboard for X wins, O wins, and draws.
- Reset Game and Reset Scoreboard actions.
- Responsive, accessible UI.

The application is frontend-only. It does not call a backend or external API.

## 2. Tech Stack

- React 19 with functional components
- JavaScript ES6+
- Vite
- `useState` for state management
- Props and callback functions
- Pure JavaScript game logic
- CSS Grid and standard CSS
- Vitest
- React Testing Library
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- jsdom
- oxlint
- Git and GitHub

No TypeScript, `useReducer`, Redux/Zustand/MobX, React Context for game state, backend, REST API, Axios/fetch, mock API server, or database is used.

## 3. Functional Features

### Game board

- Nine semantic `<button>` cells.
- Cells start empty.
- X and O alternate in two-player mode.
- Occupied cells cannot be overwritten.
- The board is disabled after a win or draw.
- Winning cells receive a visible highlight.

### Game results

`calculateGameResult(board)` is a pure function that returns:

```js
{
  status: "InProgress" | "Won" | "Draw",
  winner: "X" | "O" | null,
  winningCells: number[],
}
```

All eight winning combinations are checked: three rows, three columns, and two diagonals.

### Move history

Each move stores only the player and cell index:

```js
{ player: "X", index: 4 }
```

The UI derives:

- Move number from history order.
- Row from `Math.floor(index / 3) + 1`.
- Column from `(index % 3) + 1`.

Rows and columns are displayed as 1-based values. Internal board indexes remain 0–8.

### Undo

- Two-player mode removes the last move.
- Computer mode removes the latest human/computer pair.
- If a human move has no computer response, computer-mode undo safely removes that single move.
- Undo is disabled when there are no moves.
- Undo is disabled after game completion per **Option A**.

### Reset

- **Reset Game** clears the board, history, and result, sets X active, preserves the scoreboard, and preserves the selected mode.
- **Reset Scoreboard** clears X wins, O wins, and draws without changing the active board.

### Computer mode

- Human is X.
- Computer is O.
- The computer’s priority is:
  1. Win immediately.
  2. Block X’s immediate win.
  3. Take the center.
  4. Take an available corner.
  5. Take any remaining empty cell.
- Corners are chosen in fixed order: `0, 2, 6, 8`.
- Remaining cells are chosen in fixed order: `1, 3, 5, 7`.
- No Minimax is used.

## 4. Frontend-Only Architecture

This project intentionally omits .NET, REST APIs, databases, and server-side game state based on the recruiter’s clarification that the backend is not mandatory.

The frontend owns:

- Board state.
- Move history.
- Game mode.
- Scoreboard.

A real backend would own authoritative game state and validate every move. In this frontend-only version, the same validation rules are enforced in pure JavaScript functions.

## 5. Local Setup

Prerequisite: Node 22 LTS is recommended. Current Vite versions require a modern Node runtime; Node 20.19+ or 22.12+ is the practical minimum.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173/
```

Available scripts:

```bash
npm run dev        # start the development server
npm test           # run all tests once
npm run test:watch # run tests in watch mode
npm run lint       # run oxlint
npm run build      # create a production build in dist/
npm run preview    # preview the production build locally
```

## 6. Test Instructions

```bash
npm test
```

The test suite covers:

- Initial game state.
- Valid moves.
- Invalid moves: out-of-range index, occupied cell, wrong player, post-completion move.
- Turn switching.
- Row, column, and diagonal wins.
- Draw detection.
- Two-player undo.
- Computer-mode undo, including an unmatched human move.
- Undo disabled after completion.
- Scoreboard updates exactly once.
- Reset Game preserving the scoreboard.
- Reset Scoreboard clearing counters.
- Mode switching resetting the active board.
- Computer win, block, center, corner, and fallback priority.
- Computer not moving after completion.
- Human win in computer mode without an extra computer move.
- Rapid duplicate clicks.

## 7. State-Management Design

Two `useState` values are used:

```js
const [game, setGame] = useState(() => createInitialGame("two-player"));
const [scoreboard, setScoreboard] = useState({
  X: 0,
  O: 0,
  draws: 0,
});
```

`game` contains:

```js
{
  board: Array(9).fill(null),
  moveHistory: [],
  mode: "two-player" | "computer",
}
```

Board, history, and mode belong to the same game session, so they change atomically through one `setGame` call. The scoreboard is separate because it outlives individual games and has a different reset policy.

Derived values are not stored:

- `result = calculateGameResult(game.board)`
- `currentPlayer` from `game.moveHistory.length % 2`
- `isGameOver` from `result.status`
- `canUndo` from history length and completion
- `isHumanTurn` from mode and current player

Pure helpers:

- `createInitialGame(mode)`
- `calculateGameResult(board)`
- `getCurrentPlayer(game)`
- `isValidMove(game, index, player)`
- `applyMove(game, index, player)`
- `undoMove(game)`
- `resetGame(game)`
- `getComputerMove(board)`

The event handler calculates the complete next turn, including the computer response, before committing state:

```js
setGame(nextGame);
commitScore(nextResult);
```

The scoreboard is updated in the event handler, not in `useEffect` and not inside a state updater. This avoids double-counting and keeps updater functions pure, which matters because React StrictMode can invoke updaters more than once in development.

### History as state

The board is the canonical source of truth for the current position. Move history is the canonical record of move order and ownership. They are updated together by pure transitions. Undo reconstructs the board from the remaining history, which guarantees the restored position matches the recorded sequence.

## 8. Computer Algorithm

`src/game/computerLogic.js` exposes one main pure function:

```js
getComputerMove(board)
```

It returns a cell index or `null` when no move is available.

The implementation:

1. Returns `null` if the game is already complete.
2. Tries every empty cell for an immediate O win.
3. Tries every empty cell to block an immediate X win.
4. Chooses center index `4` if empty.
5. Chooses the first empty corner in `[0, 2, 6, 8]`.
6. Chooses the first empty remaining cell in `[1, 3, 5, 7]`.
7. Returns `null` if no cell remains.

The function is deterministic and does not mutate the board. It is intentionally not unbeatable; the assignment requires this priority strategy, not Minimax.

## 9. Clarifications and Assumptions

- Backend, .NET, REST APIs, and databases are intentionally omitted per recruiter clarification.
- X always starts.
- In computer mode, the human is X and the computer is O.
- The human cannot play O. The UI disables the board when it is not the human’s turn, and the click handler rejects non-human turns.
- Move history stores the 0-based cell index; row and column are displayed as 1-based values.
- A draw requires all nine cells to be occupied with no winner.
- Switching game mode starts a fresh board and clears history; the scoreboard is preserved.
- Reset Game preserves the selected mode and the scoreboard.
- Reset Scoreboard clears only the scoreboard.
- Scores are kept in memory and are lost on refresh. `sessionStorage` is not implemented.
- If a board somehow contains multiple winning lines, the first combination in the fixed order is returned and highlighted.

## 10. Undo Policy

The project uses **Option A: Disable Undo After Completion**.

Reasons:

- A completed game has already incremented the scoreboard.
- Allowing undo after completion would require deciding whether to reverse the score.
- Disabling undo keeps the scoreboard consistent and avoids ambiguous game history.

Behavior:

- Two-player: remove the last move.
- Computer: remove the last human/computer pair.
- Computer with only a human move: remove that single move.
- No moves: Undo disabled.
- Game complete: Undo disabled.

## 11. AI Usage Summary

AI assistance was used as a pair-programming and teaching aid.

AI-assisted work included:

- Comparing multiple-`useState` versus single-game-object state designs.
- Proposing the component tree and state ownership.
- Drafting the pure game and computer logic.
- Drafting React components and CSS.
- Drafting Vitest and React Testing Library tests.
- Running lint, production build, and the test suite.
- Drafting this README.

Verification performed during implementation:

- `npm test` passes 43 tests across 4 test files.
- `npm run lint` passes.
- `npm run build` succeeds.

No claim is made that every line was manually typed by the candidate. Before submission, the candidate should review the code, make at least the small modifications they can explain, and be prepared to describe which parts were AI-generated, which parts they changed, and how they verified behavior.

No backend, REST API, mock server, or external database was generated.

## 12. Known Limitations

- No backend or persistent storage; scores reset on page refresh.
- The computer is deterministic but not unbeatable, by design.
- Only the first winning combination is highlighted if multiple lines are completed at once.
- No sessionStorage or localStorage persistence.
- No end-to-end browser tests; coverage is unit and component level.
- No deployment URL yet.
- The computer fallback order is defensive; in normal legal corner/center states, a win or block usually exists first.

## 13. Future Enhancements

- Add optional `sessionStorage` score persistence.
- Add a Minimax or difficulty selector while preserving the required deterministic mode.
- Add animations and sound feedback.
- Add undo confirmation or a two-step score-safe undo policy.
- Add Playwright end-to-end tests.
- Add backend-owned game state and multiplayer rooms.
- Add TypeScript if the project grows.
- Add deployment automation.

## 14. Optional Deployment Link

Not deployed yet. For Vercel or Netlify:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

Add the live URL here after deployment:

```text
https://your-deployment-url.example
```
