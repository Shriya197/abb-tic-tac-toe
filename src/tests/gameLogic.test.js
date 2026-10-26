import { describe, expect, it } from "vitest";
import {
  applyMove,
  calculateGameResult,
  createInitialGame,
  getCurrentPlayer,
  isValidMove,
  resetGame,
  undoMove,
} from "../game/gameLogic.js";

function makeBoard(moves) {
  const board = Array(9).fill(null);

  for (const [index, player] of moves) {
    board[index] = player;
  }

  return board;
}

function playMoves(moves, mode = "two-player") {
  let game = createInitialGame(mode);

  for (const [index, player] of moves) {
    game = applyMove(game, index, player);
  }

  return game;
}

describe("createInitialGame", () => {
  it("creates an empty board with X to move", () => {
    const game = createInitialGame();

    expect(game.board).toEqual(Array(9).fill(null));
    expect(game.moveHistory).toEqual([]);
    expect(game.mode).toBe("two-player");
    expect(getCurrentPlayer(game)).toBe("X");
  });
});

describe("calculateGameResult", () => {
  it("reports an in-progress game", () => {
    expect(calculateGameResult(Array(9).fill(null))).toEqual({
      status: "InProgress",
      winner: null,
      winningCells: [],
    });
  });

  it("detects a row win", () => {
    const board = makeBoard([
      [0, "X"],
      [1, "X"],
      [2, "X"],
    ]);

    expect(calculateGameResult(board)).toEqual({
      status: "Won",
      winner: "X",
      winningCells: [0, 1, 2],
    });
  });

  it("detects a column win", () => {
    const board = makeBoard([
      [2, "O"],
      [5, "O"],
      [8, "O"],
    ]);

    expect(calculateGameResult(board)).toEqual({
      status: "Won",
      winner: "O",
      winningCells: [2, 5, 8],
    });
  });

  it("detects a diagonal win", () => {
    const board = makeBoard([
      [0, "X"],
      [4, "X"],
      [8, "X"],
    ]);

    expect(calculateGameResult(board)).toEqual({
      status: "Won",
      winner: "X",
      winningCells: [0, 4, 8],
    });
  });

  it("detects an anti-diagonal win", () => {
    const board = makeBoard([
      [2, "O"],
      [4, "O"],
      [6, "O"],
    ]);

    expect(calculateGameResult(board)).toEqual({
      status: "Won",
      winner: "O",
      winningCells: [2, 4, 6],
    });
  });

  it("detects a draw", () => {
    const board = makeBoard([
      [0, "X"],
      [1, "O"],
      [2, "X"],
      [3, "X"],
      [4, "O"],
      [5, "O"],
      [6, "O"],
      [7, "X"],
      [8, "X"],
    ]);

    expect(calculateGameResult(board)).toEqual({
      status: "Draw",
      winner: null,
      winningCells: [],
    });
  });
});

describe("isValidMove", () => {
  it("accepts the first move for X", () => {
    expect(isValidMove(createInitialGame(), 0, "X")).toBe(true);
  });

  it("rejects out-of-range and non-integer indexes", () => {
    const game = createInitialGame();

    expect(isValidMove(game, -1, "X")).toBe(false);
    expect(isValidMove(game, 9, "X")).toBe(false);
    expect(isValidMove(game, 1.5, "X")).toBe(false);
  });

  it("rejects a player who is not active", () => {
    const game = createInitialGame();

    expect(isValidMove(game, 0, "O")).toBe(false);
    expect(isValidMove(game, 0, "Z")).toBe(false);
  });

  it("rejects an occupied cell", () => {
    const game = applyMove(createInitialGame(), 0, "X");

    expect(isValidMove(game, 0, "O")).toBe(false);
  });

  it("rejects a move after game completion", () => {
    const game = playMoves([
      [0, "X"],
      [3, "O"],
      [1, "X"],
      [4, "O"],
      [2, "X"],
    ]);

    expect(calculateGameResult(game.board).status).toBe("Won");
    expect(isValidMove(game, 5, "O")).toBe(false);
  });
});

describe("applyMove", () => {
  it("returns a new game without mutating the previous one", () => {
    const game = createInitialGame();
    const nextGame = applyMove(game, 4, "X");

    expect(nextGame).not.toBe(game);
    expect(game.board[4]).toBeNull();
    expect(nextGame.board[4]).toBe("X");
    expect(nextGame.moveHistory).toEqual([{ player: "X", index: 4 }]);
  });

  it("switches the active player after a valid move", () => {
    const game = applyMove(createInitialGame(), 0, "X");

    expect(getCurrentPlayer(game)).toBe("O");
  });

  it("returns the same game for an invalid move", () => {
    const game = createInitialGame();

    expect(applyMove(game, 0, "O")).toBe(game);
  });
});

describe("undoMove", () => {
  it("removes the last move in two-player mode", () => {
    const game = playMoves([
      [0, "X"],
      [4, "O"],
    ]);

    const undone = undoMove(game);

    expect(undone.board[4]).toBeNull();
    expect(undone.board[0]).toBe("X");
    expect(undone.moveHistory).toEqual([{ player: "X", index: 0 }]);
    expect(getCurrentPlayer(undone)).toBe("O");
  });

  it("removes the latest human/computer pair in computer mode", () => {
    const game = playMoves(
      [
        [0, "X"],
        [4, "O"],
      ],
      "computer",
    );

    const undone = undoMove(game);

    expect(undone.board).toEqual(Array(9).fill(null));
    expect(undone.moveHistory).toEqual([]);
    expect(getCurrentPlayer(undone)).toBe("X");
  });

  it("safely removes an unmatched human move in computer mode", () => {
    const game = playMoves([[0, "X"]], "computer");

    const undone = undoMove(game);

    expect(undone.board).toEqual(Array(9).fill(null));
    expect(undone.moveHistory).toEqual([]);
    expect(getCurrentPlayer(undone)).toBe("X");
  });

  it("returns the same game when there is no history", () => {
    const game = createInitialGame();

    expect(undoMove(game)).toBe(game);
  });
});

describe("resetGame", () => {
  it("clears the board and history but preserves the mode", () => {
    const game = playMoves(
      [
        [0, "X"],
        [4, "O"],
      ],
      "computer",
    );

    const reset = resetGame(game);

    expect(reset.board).toEqual(Array(9).fill(null));
    expect(reset.moveHistory).toEqual([]);
    expect(reset.mode).toBe("computer");
    expect(getCurrentPlayer(reset)).toBe("X");
  });
});
