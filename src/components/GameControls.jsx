function GameControls({
  canUndo,
  onUndo,
  onResetGame,
  onResetScoreboard,
}) {
  return (
    <div className="game-controls">
      <button type="button" onClick={onUndo} disabled={!canUndo}>
        Undo
      </button>
      <button type="button" onClick={onResetGame}>
        Reset Game
      </button>
      <button type="button" onClick={onResetScoreboard}>
        Reset Scoreboard
      </button>
    </div>
  );
}

export default GameControls;
