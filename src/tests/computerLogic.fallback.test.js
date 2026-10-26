import { describe, expect, it, vi } from "vitest";

vi.mock("../game/gameLogic.js", () => ({
  calculateGameResult: vi.fn(() => ({
    status: "InProgress",
    winner: null,
    winningCells: [],
  })),
}));

import { getComputerMove } from "../game/computerLogic.js";

describe("getComputerMove fallback priority", () => {
  it("chooses the first empty fallback cell when no better move exists", () => {
    const board = ["X", null, "O", null, "X", null, "O", null, "X"];

    expect(getComputerMove(board)).toBe(1);
  });

  it("moves to the next fallback cell when the first is occupied", () => {
    const board = ["X", "O", "O", null, "X", null, "O", null, "X"];

    expect(getComputerMove(board)).toBe(3);
  });
});
