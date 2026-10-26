export const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function createInitialGame(mode = "two-player") {
  return {
    board: Array(9).fill(null),
    moveHistory: [],
    mode,
  };
}

export function calculateGameResult(board) {
  for (const combination of WINNING_COMBINATIONS) {
    const [first, second, third] = combination;

    if (
      board[first] &&
      board[first] === board[second] &&
      board[first] === board[third]
    ) {
      return {
        status: "Won",
        winner: board[first],
        winningCells: [...combination],
      };
    }
  }

  if (board.every((cell) => cell !== null) ){
    return {
      status: "Draw",
      winner: null,
      winningCells: [],
    };
  }

  return {
    status: "InProgress",
    winner: null,
    winningCells: [],
  };
}

export function getCurrentPlayer(game) {
  return game.moveHistory.length % 2 === 0 ? "X" : "O";
}

export function isValidMove(game, index, player) {
  if (game.board[index] !== null) {
    return false;
  }

  if (player !== getCurrentPlayer(game)) {
    return false;
  }

  return calculateGameResult(game.board).status === "InProgress";
}

export function applyMove(game, index, player) {
  if (!isValidMove(game, index, player)) {
    return game;
  }

  const board = [...game.board];
  board[index] = player;

  return {
    ...game,
    board,
    moveHistory: [...game.moveHistory, { player, index }],
  };
}

function createBoardFromHistory(moveHistory) {
  const board = Array(9).fill(null);

  for (const move of moveHistory) {
    board[move.index] = move.player;
  }

  return board;
}

export function undoMove(game) {
  if (game.moveHistory.length === 0) {
    return game;
  }

  const lastMove = game.moveHistory[game.moveHistory.length - 1];
  const movesToRemove = game.mode === "computer" && lastMove.player === "O" ? 2 : 1;
  const moveHistory = game.moveHistory.slice(0, -movesToRemove);

  const newGame = {
    ...game, 
    board: createBoardFromHistory(moveHistory),
    moveHistory
  }

  return newGame;
}

export function resetGame(game) {
  return createInitialGame(game.mode);
}
