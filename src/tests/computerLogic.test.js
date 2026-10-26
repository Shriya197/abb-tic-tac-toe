import { describe, expect, it } from "vitest";
import { getComputerMove } from "../game/computerLogic.js";

function makeBoard(moves) {
  const board = Array(9).fill(null);

  for (const [index, player] of moves) {
    board[index] = player;
  }

  return board;
}

describe("getComputerMove", () => {
  it("takes an immediate win before anything else", () => {
    const board = makeBoard([
      [0, "O"],
      [1, "O"],
      [3, "X"],
      [4, "X"],
    ]);

    expect(getComputerMove(board)).toBe(2);
  });

  it("blocks an immediate X win", () => {
    const board = makeBoard([
      [0, "X"],
      [1, "X"],
      [4, "O"],
    ]);

    expect(getComputerMove(board)).toBe(2);
  });

  it("selects the center when it is empty", () => {
    const board = makeBoard([
      [0, "X"],
      [8, "O"],
    ]);

    expect(getComputerMove(board)).toBe(4);
  });

  it("selects the first available corner in fixed order", () => {
    const board = makeBoard([
      [4, "X"],
      [8, "O"],
    ]);

    expect(getComputerMove(board)).toBe(0);
  });

  it("returns null after the game is complete", () => {
    const board = makeBoard([
      [0, "X"],
      [1, "X"],
      [2, "X"],
      [3, "O"],
      [4, "O"],
    ]);

    expect(getComputerMove(board)).toBeNull();
  });

  it("returns null for a full draw board", () => {
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

    expect(getComputerMove(board)).toBeNull();
  });
});
