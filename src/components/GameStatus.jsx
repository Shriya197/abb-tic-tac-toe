function GameStatus({ mode, currentPlayer, result }) {
  let message;

  if (result.status === "Won") {
    message = `${result.winner} wins!`;
  } else if (result.status === "Draw") {
    message = "It's a draw!";
  } else if (mode === "computer") {
    message =
      currentPlayer === "X"
        ? "Your turn (X)"
        : "Computer's turn (O)";
  } else {
    message = `Player ${currentPlayer}'s turn`;
  }

  return (
    <p
      className={`game-status${result.status !== "InProgress" ? " game-status-over" : ""}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </p>
  );
}

export default GameStatus;
