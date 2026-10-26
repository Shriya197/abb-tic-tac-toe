# ABB Tic Tac Toe

A browser-based Tic Tac Toe application built using **React.js and JavaScript** as part of the ABB technical assignment.

The application supports two-player gameplay, a computer opponent, move history, undo functionality, win/draw detection, and a session-level scoreboard.

The project focuses on clean component architecture, predictable state management, reusable game logic, and testability.

## 1. Features

- **Two-Player Mode:** Two users play locally, alternating between X and O.
- **Computer Mode:** Play as X against a computer-controlled O.
- **Win Detection:** Detects wins across rows, columns, and diagonals.
- **Draw Detection:** Identifies a draw when all cells are filled without a winner.
- **Winning Cell Highlighting:** Highlights the cells forming the winning combination.
- **Move History:** Records each move, including player, move number, and board position.
- **Undo Last Move:** Restores the previous game state based on the selected mode.
- **Scoreboard:** Tracks X wins, O wins, and draws across multiple games.
- **Reset Game:** Starts a fresh game without resetting the scoreboard.
- **Reset Scoreboard:** Clears the scores independently of the current game.
- **Responsive UI:** Supports laptop and smaller screen sizes.

## 2. Tech Stack

| Technology            | Purpose                                    |
| --------------------- | ------------------------------------------ |
| React 19              | UI development using functional components |
| JavaScript (ES6+)     | Application and game logic                 |
| Vite                  | Development server and production build    |
| React `useState`      | Local state management                     |
| CSS / CSS Grid        | Styling and responsive board layout        |
| Vitest                | Unit testing                               |
| React Testing Library | Component and interaction testing          |
| Git & GitHub          | Version control and submission             |

The application runs entirely in the browser. No backend, external API, or database is required.

## 3. Getting Started

### Prerequisites

- Node.js 22.12+ (or a compatible version supported by the installed Vite release)
- npm
- Git

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd abb-tic-tac-toe
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

`http://localhost:5173`

### Available Commands

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start the development server |
| `npm test`           | Run the test suite           |
| `npm run test:watch` | Run tests in watch mode      |
| `npm run lint`       | Run code linting             |
| `npm run build`      | Create the production build  |
| `npm run preview`    | Preview the production build |

## 4. Application Architecture

The application follows a component-based architecture with a clear separation between **UI components, React state management, and game logic**.

### Component Structure

```text
App
├── GameModeSelector
├── GameStatus
├── GameBoard
│   └── GameCell
├── GameControls
├── Scoreboard
└── MoveHistory
```

### Component Responsibilities

| Component          | Responsibility                                  |
| ------------------ | ----------------------------------------------- |
| `App`              | Owns game state, scoreboard, and event handlers |
| `GameBoard`        | Renders the 3×3 board                           |
| `GameCell`         | Renders an individual clickable cell            |
| `GameStatus`       | Displays the current turn or game result        |
| `GameModeSelector` | Allows switching between game modes             |
| `GameControls`     | Handles Undo and Reset Game actions             |
| `MoveHistory`      | Displays previously played moves                |
| `Scoreboard`       | Displays scores and provides scoreboard reset   |

**Why this architecture?**

The main `App` component owns the shared state. Child components receive the information they need through props and communicate user actions through callback functions.

This keeps responsibilities clear and avoids duplicating game state across multiple components.

The game rules are implemented separately from React, making them easier to test and maintain.

## 5. State Management

The application uses React's built-in `useState` hook.

Two main state variables are maintained:

```jsx
const [game, setGame] = useState(() =>
  createInitialGame("two-player")
);

const [scoreboard, setScoreboard] = useState({
  X: 0,
  O: 0,
  draws: 0,
});
```

### Game State

The `game` object contains:

```javascript
{
  board: Array(9).fill(null),
  moveHistory: [],
  mode: "two-player"
}
```

- `board` represents the nine cells.
- `moveHistory` records the sequence of valid moves.
- `mode` identifies the selected game mode.

These values are grouped because they belong to the same active game session and are updated together during game transitions.

### Scoreboard State

The scoreboard is stored separately because its lifecycle differs from the current game.

For example:

- Reset Game clears the active game but preserves scores.
- Reset Scoreboard clears scores without modifying the active game.

### Derived State

Values that can be calculated from existing state are not stored separately.

These include:

- Current player
- Winner
- Winning cells
- Game status
- Whether Undo is available

For example:

```javascript
const currentPlayer =
  game.moveHistory.length % 2 === 0
    ? "X"
    : "O";

const result = calculateGameResult(game.board);

const isGameOver = result.status !== "InProgress";
```

**Why derive these values?**

Storing the same information in multiple state variables can create inconsistencies.

For example, if the board changes but a separately stored winner is not updated, the UI may display an incorrect result.

Deriving game status from the board ensures the displayed result is based on the current position.

### Why `useState` Instead of Context or Redux?

The application has a small component tree and a single common state owner.

Using `useState` with props is sufficient because:

- State ownership is clear.
- Data flows from parent to child.
- Updates are easier to trace.
- No additional state-management library is required.

React Context would become useful if many deeply nested components required shared access to the same state.

For the current application, introducing Context or Redux would add unnecessary complexity.

## 6. How a Move Works

When a player clicks a cell, the application follows this sequence:

```text
User clicks a cell
        |
        v
Validate the move
        |
        v
Check cell availability and game status
        |
        v
Apply the player's move
        |
        v
Update board and move history
        |
        v
Calculate win or draw
        |
        v
If computer mode and game continues:
    Calculate and apply computer move
        |
        v
Calculate final game result
        |
        v
Update scoreboard if the game finishes
        |
        v
React renders the updated UI
```

The transition logic is separated into pure JavaScript functions.

The event handler calculates the next game state, including the computer response where applicable, before committing the state update.

This approach keeps move handling predictable and avoids unnecessary effects for the computer's decision-making.

### Move Validation

Before applying a move, the game checks that:

1. The selected cell index is within the board.
2. The cell is empty.
3. The game is still in progress.
4. The correct player is making the move.

Invalid moves do not modify the current state.

## 7. Game Logic

Game logic is separated from React components and implemented using pure JavaScript functions.

The main functions include:

| Function                           | Responsibility                                 |
| ---------------------------------- | ---------------------------------------------- |
| `createInitialGame(mode)`          | Creates a fresh game                           |
| `calculateGameResult(board)`       | Determines win, draw, or in-progress status    |
| `getCurrentPlayer(game)`           | Determines whose turn it is                    |
| `isValidMove(game, index, player)` | Validates a move                               |
| `applyMove(game, index, player)`   | Calculates the next game state                 |
| `undoMove(game)`                   | Restores the previous state                    |
| `resetGame(game)`                  | Creates a fresh board while retaining the mode |
| `getComputerMove(board)`           | Selects the computer's next move               |

### Win Detection

The game evaluates eight possible winning combinations:

- Three horizontal rows
- Three vertical columns
- Two diagonals

`calculateGameResult(board)` returns:

```javascript
{
  status: "Won",
  winner: "X",
  winningCells: [0, 1, 2]
}
```

The possible statuses are:

- `InProgress`
- `Won`
- `Draw`

The winning cell indices are used by the UI to highlight the winning combination.

### Why Pure Functions?

Pure functions:

- Do not directly modify React state.
- Do not mutate their inputs.
- Produce predictable results for the same inputs.
- Can be tested independently of React components.

This separates game rules from UI rendering.

## 8. Move History and Undo

### Move History

Each valid move is stored as an object:

```javascript
{
  player: "X",
  index: 4
}
```

The move history is an ordered array:

```javascript
[
  { player: "X", index: 0 },
  { player: "O", index: 4 },
  { player: "X", index: 2 }
]
```

Move numbers and positions are derived rather than stored separately.

For example:

```javascript
const moveNumber = historyIndex + 1;
const row = Math.floor(index / 3) + 1;
const column = (index % 3) + 1;
```

This avoids storing redundant information.

### Undo Behavior

Undo depends on the selected game mode.

**Two-Player Mode**

The latest move is removed from history, and the corresponding board position is restored.

**Computer Mode**

The latest human and computer moves are removed together, restoring the previous human turn.

If only a human move exists, Undo can remove that single move.

### How the Board Is Restored

Instead of manually reversing every state field, Undo uses the remaining move history to reconstruct the board.

```javascript
const restoredBoard = Array(9).fill(null);

remainingHistory.forEach((move) => {
  restoredBoard[move.index] = move.player;
});
```

This ensures the board matches the recorded sequence of moves.

### Undo After Completion — Option A

The application follows **Option A from the assignment: Disable Undo After Completion**.

After a win or draw:

- The completed result is final.
- Undo is disabled.
- The scoreboard remains unchanged.

This avoids having to reverse previously recorded scores.

## 9. Computer Opponent

The computer uses a deterministic, rule-based algorithm.

In computer mode:

- Human plays X.
- Computer plays O.
- The computer automatically responds after a valid human move, provided the game has not ended.

### Move Selection Priority

| Priority | Rule                                      |
| -------- | ----------------------------------------- |
| 1        | Choose a move that immediately wins for O |
| 2        | Block an immediate winning move for X     |
| 3        | Take the center if available              |
| 4        | Choose an available corner                |
| 5        | Choose any remaining empty cell           |

Corner selection order:

`[0, 2, 6, 8]`

Remaining-cell selection order:

`[1, 3, 5, 7]`

### Why a Rule-Based Algorithm?

The assignment explicitly specifies the computer's priorities.

A deterministic algorithm is sufficient because:

- It directly implements the requirements.
- It is easy to understand and debug.
- Its decisions can be tested.
- It avoids the additional complexity of Minimax.

The computer is not intended to be unbeatable.

## 10. Scoreboard

The scoreboard tracks:

```javascript
{
  X: 0,
  O: 0,
  draws: 0
}
```

The score changes only when a game transitions from an in-progress state to a completed state.

This prevents repeated counting when React re-renders a completed board.

Scoreboard updates are coordinated by the game event handler, rather than triggered by an effect that watches the winner.

### Reset Behavior

| Action           | Board     | History   | Scoreboard |
| ---------------- | --------- | --------- | ---------- |
| Reset Game       | Cleared   | Cleared   | Preserved  |
| Reset Scoreboard | Unchanged | Unchanged | Cleared    |
| Change Mode      | Cleared   | Cleared   | Preserved  |

Scores are maintained in memory for the current page session.

Refreshing the page resets them because browser storage persistence is not implemented.

## 11. Testing

The application uses Vitest and React Testing Library.

The tests focus on game logic, state transitions, and UI interactions.

### Game Logic Tests

- Initial game state
- Valid and invalid moves
- Player turn switching
- Row, column, and diagonal wins
- Draw detection
- Invalid moves after game completion
- Out-of-range and occupied-cell validation
- Wrong-player validation

### Undo and Reset Tests

- Undo in two-player mode
- Undo in computer mode
- Undo with an unmatched human move
- Undo disabled after completion
- Reset Game preserving scoreboard
- Reset Scoreboard clearing scores
- Game-mode switching

### Computer Tests

- Winning move selection
- Blocking move selection
- Center selection
- Corner selection
- Fallback selection
- No move after game completion
- Human win without an additional computer move

### UI Tests

- Board interactions
- Correct player and status display
- Disabled cells
- Move history updates
- Rapid duplicate clicks

### Run Tests

```bash
npm test
```

### Code Quality Checks

```bash
npm run lint
npm run build
```

**Test results recorded during development:**

- 43 tests across 4 files
- Lint checks passed
- Production build succeeded

These results should be rechecked against the final submitted commit.

## 12. Design Decisions and Trade-offs

| Decision                        | Reason                                                         |
| ------------------------------- | -------------------------------------------------------------- |
| React `useState`                | Sufficient for the small application and clear state ownership |
| Parent-owned game state         | Keeps related state coordinated                                |
| Props over Context              | Shallow component hierarchy without significant prop drilling  |
| Pure game logic                 | Separates business rules from rendering and simplifies testing |
| Derived game status             | Avoids redundant state and inconsistencies                     |
| Move history for Undo           | Makes previous positions straightforward to reconstruct        |
| Synchronous computer response   | Keeps the complete turn transition predictable                 |
| Disable Undo after completion   | Keeps finalized scoreboard results consistent                  |
| Deterministic computer strategy | Directly matches the assignment requirements                   |
| Frontend-only implementation    | Matches the recruiter's backend-optional clarification         |

### Backend Considerations

The original assignment includes .NET and REST API requirements.

Based on the recruiter's clarification that the backend is optional, this submission implements all game operations locally in React and JavaScript.

There are no actual REST endpoints.

If a backend were added later, it would become responsible for validating moves, managing sessions, recording history, and maintaining the scoreboard. React would render the state received from the server.

## 13. Assumptions and Limitations

### Assumptions

- X always starts.
- The human controls X in computer mode.
- The computer controls O.
- Switching game modes starts a new board while preserving scores.
- Reset Game preserves the selected mode.
- Undo is disabled after game completion.
- Board indices are 0-based internally and displayed as 1-based rows and columns.
- Scores exist only during the current page session.

### Known Limitations

- No backend or shared multiplayer state.
- Scores do not survive page refreshes.
- The computer is deterministic but not unbeatable.
- Only the first detected winning combination is highlighted when multiple winning lines exist.
- No end-to-end browser testing.
- No live deployment URL is currently provided.

## 14. AI-Assisted Development

AI-assisted tools were used during development to support implementation, architectural discussions, and testing.

Areas of assistance included:

- Evaluating state-management approaches.
- Discussing component separation and state ownership.
- Drafting game and computer logic.
- Assisting with React components and styling.
- Drafting unit and interaction tests.
- Preparing documentation.

Key areas for manual review include move validation, game-result detection, score consistency, mode-specific undo, and computer move priorities.



## 15. Future Improvements

Potential improvements include:

- `sessionStorage` or `localStorage` persistence.
- Difficulty levels and a Minimax-based opponent.
- Animations and sound effects.
- Playwright end-to-end tests.
- Backend-managed sessions and multiplayer functionality.
- TypeScript for stronger type safety if the project grows.
- Automated deployment through GitHub integration.

## 16. Deployment

The application can be deployed as a static Vite application using Vercel or Netlify.

Production build:

```bash
npm run build
```

Preview locally:

```bash
npm run preview
```

Suggested deployment settings:

| Setting          | Value           |
| ---------------- | --------------- |
| Build command    | `npm run build` |
| Output directory | `dist`          |
| Install command  | `npm install`   |

**Live application:** Not deployed yet.
