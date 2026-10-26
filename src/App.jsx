import { useState } from "react";

import GameBoard from "./components/GameBoard.jsx";
import GameControls from "./components/GameControls.jsx";
import GameModeSelector from "./components/GameModeSelector.jsx";
import GameStatus from "./components/GameStatus.jsx";
import MoveHistory from "./components/MoveHistory.jsx";
import Scoreboard from "./components/Scoreboard.jsx";
import { getComputerMove } from "./game/computerLogic.js";
import {
  applyMove,
  calculateGameResult,
  createInitialGame,
  getCurrentPlayer,
  isValidMove,
  resetGame,
  undoMove,
} from "./game/gameLogic.js";

import "./App.css";

const INITIAL_SCOREBOARD = {
  X: 0,
  O: 0,
  draws: 0,
};

function App() {
  const [game, setGame] = useState(() => createInitialGame("two-player"));
  const [scoreboard, setScoreboard] = useState(INITIAL_SCOREBOARD);

  const result = calculateGameResult(game.board);
  const currentPlayer = getCurrentPlayer(game);
  const isGameOver = result.status !== "InProgress";
  const canUndo = game.moveHistory.length > 0 && !isGameOver;
  const isHumanTurn = game.mode === "two-player" || currentPlayer === "X";

  function commitScore(nextResult) {
    if (nextResult.status === "InProgress") {
      return;
    }

    setScoreboard((previous) => ({
      ...previous,
      X: previous.X + (nextResult.winner === "X" ? 1 : 0),
      O: previous.O + (nextResult.winner === "O" ? 1 : 0),
      draws: previous.draws + (nextResult.status === "Draw" ? 1 : 0),
    }));
  }

  function handleCellClick(index) {
    if (isGameOver || !isHumanTurn) {
      return;
    }

    if (!isValidMove(game, index, currentPlayer)) {
      return;
    }

    let nextGame = applyMove(game, index, currentPlayer);
    let nextResult = calculateGameResult(nextGame.board);

    if (game.mode === "computer" && nextResult.status === "InProgress") {
      const computerIndex = getComputerMove(nextGame.board);

      if (computerIndex !== null) {
        nextGame = applyMove(nextGame, computerIndex, "O");
        nextResult = calculateGameResult(nextGame.board);
      }
    }

    setGame(nextGame);
    commitScore(nextResult);
  }

  function handleUndo() {
    if (!canUndo) {
      return;
    }

    setGame((currentGame) => undoMove(currentGame));
  }

  function handleResetGame() {
    setGame((currentGame) => resetGame(currentGame));
  }

  function handleResetScoreboard() {
    setScoreboard({ ...INITIAL_SCOREBOARD });
  }

  function handleModeChange(nextMode) {
    if (nextMode === game.mode) {
      return;
    }

    setGame(createInitialGame(nextMode));
  }

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">ABB Technical Assignment</p>
        <h1>Tic Tac Toe</h1>
        <p className="subtitle">
          Two-player and computer modes, pure game logic, and a separate
          scoreboard.
        </p>
      </header>

      <section className="layout">
        <div className="game-panel">
          <GameModeSelector
            mode={game.mode}
            onModeChange={handleModeChange}
          />

          <GameStatus
            mode={game.mode}
            currentPlayer={currentPlayer}
            result={result}
          />

          <GameBoard
            board={game.board}
            winningCells={result.winningCells}
            disabled={isGameOver || !isHumanTurn}
            onCellClick={handleCellClick}
          />

          <GameControls
            canUndo={canUndo}
            onUndo={handleUndo}
            onResetGame={handleResetGame}
            onResetScoreboard={handleResetScoreboard}
          />
        </div>

        <aside className="side-panel">
          <Scoreboard scoreboard={scoreboard} />
          <MoveHistory moveHistory={game.moveHistory} />
        </aside>
      </section>
    </main>
  );
}

export default App;
