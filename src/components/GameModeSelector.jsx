function GameModeSelector({ mode, onModeChange }) {
  return (
    <>
      <fieldset className="mode-selector">
        <legend>Game mode</legend>

        <label>
          <input
            type="radio"
            name="game-mode"
            value="two-player"
            checked={mode === "two-player"}
            onChange={() => onModeChange("two-player")}
          />
          Two player
        </label>

        <label>
          <input
            type="radio"
            name="game-mode"
            value="computer"
            checked={mode === "computer"}
            onChange={() => onModeChange("computer")}
          />
          Computer
        </label>
      </fieldset>

      <p className="mode-hint">Switching mode starts a new game.</p>
    </>
  );
}

export default GameModeSelector;
