function GameCell({ value, index, isWinning, disabled, onCellClick }) {
  const label = value
    ? `Cell ${index + 1}, ${value}`
    : `Cell ${index + 1}, empty`;

  return (
    <button
      type="button"
      className={`game-cell${isWinning ? " game-cell--winning" : ""}`}
      onClick={() => onCellClick(index)}
      disabled={disabled || value !== null}
      aria-label={label}
    >
      {value}
    </button>
  );
}

export default GameCell;
