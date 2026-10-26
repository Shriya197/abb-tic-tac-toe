import GameCell from "./GameCell.jsx";

function GameBoard({ board, winningCells, disabled, onCellClick }) {
  return (
    <div
      className="game-board"
      role="group"
      aria-label="Tic Tac Toe board"
    >
      {board.map((value, index) => (
        <GameCell
          key={index}
          value={value}
          index={index}
          isWinning={winningCells.includes(index)}
          disabled={disabled}
          onCellClick={onCellClick}
        />
      ))}
    </div>
  );
}

export default GameBoard;
