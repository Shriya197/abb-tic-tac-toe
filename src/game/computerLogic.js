import { calculateGameResult } from "./gameLogic.js";

const CORNER_ORDER = [0, 2, 6, 8];
const FALLBACK_ORDER = [1, 3, 5, 7];

function findWinningMove(board, player) {
  for (let index = 0; index < board.length; index += 1) {
    if (board[index] !== null) {
      continue;
    }

    const candidate = [...board];
    candidate[index] = player;

    const result = calculateGameResult(candidate);

    if (result.status === "Won" && result.winner === player) {
      return index;
    }
  }

  return null;
}

export function getComputerMove(board) {
  if (calculateGameResult(board).status !== "InProgress") {
    return null;
  }

  const winningMove = findWinningMove(board, "O");
  if (winningMove !== null) {
    return winningMove;
  }

  const blockingMove = findWinningMove(board, "X");
  if (blockingMove !== null) {
    return blockingMove;
  }

  if (board[4] === null) {
    return 4;
  }

  for (const index of CORNER_ORDER) {
    if (board[index] === null) {
      return index;
    }
  }

  for (const index of FALLBACK_ORDER) {
    if (board[index] === null) {
      return index;
    }
  }

  return null;
}
