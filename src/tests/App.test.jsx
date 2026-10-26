import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "../App.jsx";

function getCell(index) {
  return screen.getByRole("button", {
    name: new RegExp(`^Cell ${index + 1},`),
  });
}

function clickCell(index) {
  fireEvent.click(getCell(index));
}

function playMoves(moves) {
  for (const index of moves) {
    clickCell(index);
  }
}

function getScore(label) {
  return screen.getByLabelText(label);
}

describe("App", () => {
  it("renders an empty board with X to move", () => {
    render(<App />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Player X's turn",
    );
    expect(
      screen.getAllByRole("button", { name: /^Cell \d+, empty$/ }),
    ).toHaveLength(9);
    expect(getScore("X wins count")).toHaveTextContent("0");
    expect(getScore("O wins count")).toHaveTextContent("0");
    expect(getScore("Draw count")).toHaveTextContent("0");
  });

  it("applies a valid move, switches turns, and records history", () => {
    render(<App />);

    clickCell(0);

    expect(getCell(0)).toHaveTextContent("X");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Player O's turn",
    );
    expect(
      screen.getByText(/Move 1: X at Row 1, Column 1/),
    ).toBeInTheDocument();
  });

  it("ignores a click on an occupied cell", () => {
    render(<App />);

    clickCell(0);
    clickCell(0);

    expect(getCell(0)).toHaveTextContent("X");
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Player O's turn",
    );
  });

  it("detects a row win, highlights cells, and scores once", () => {
    render(<App />);

    playMoves([0, 3, 1, 4, 2]);

    expect(screen.getByRole("status")).toHaveTextContent("X wins!");
    expect(getCell(0)).toHaveClass("game-cell--winning");
    expect(getCell(1)).toHaveClass("game-cell--winning");
    expect(getCell(2)).toHaveClass("game-cell--winning");
    expect(getScore("X wins count")).toHaveTextContent("1");

    fireEvent.click(getCell(5));

    expect(getScore("X wins count")).toHaveTextContent("1");
  });

  it("detects a draw and scores it once", () => {
    render(<App />);

    playMoves([0, 1, 2, 4, 3, 5, 7, 6, 8]);

    expect(screen.getByRole("status")).toHaveTextContent(
      "It's a draw!",
    );
    expect(getScore("Draw count")).toHaveTextContent("1");
    expect(getScore("X wins count")).toHaveTextContent("0");
    expect(getScore("O wins count")).toHaveTextContent("0");

    fireEvent.click(getCell(0));

    expect(getScore("Draw count")).toHaveTextContent("1");
  });

  it("undoes the last move in two-player mode", () => {
    render(<App />);

    clickCell(0);
    clickCell(4);
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));

    expect(getCell(4)).toBeEmptyDOMElement();
    expect(getCell(0)).toHaveTextContent("X");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Player O's turn",
    );

    fireEvent.click(screen.getByRole("button", { name: "Undo" }));

    expect(getCell(0)).toBeEmptyDOMElement();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Player X's turn",
    );
    expect(
      screen.getByRole("button", { name: "Undo" }),
    ).toBeDisabled();
  });

  it("disables undo after completion", () => {
    render(<App />);

    playMoves([0, 3, 1, 4, 2]);

    expect(
      screen.getByRole("button", { name: "Undo" }),
    ).toBeDisabled();
  });

  it("resets the game while preserving the scoreboard", () => {
    render(<App />);

    playMoves([0, 3, 1, 4, 2]);
    fireEvent.click(
      screen.getByRole("button", { name: "Reset Game" }),
    );

    expect(getCell(0)).toBeEmptyDOMElement();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Player X's turn",
    );
    expect(screen.getByText("No moves yet.")).toBeInTheDocument();
    expect(getScore("X wins count")).toHaveTextContent("1");
  });

  it("resets the scoreboard independently", () => {
    render(<App />);

    playMoves([0, 3, 1, 4, 2]);
    fireEvent.click(
      screen.getByRole("button", { name: "Reset Scoreboard" }),
    );

    expect(getScore("X wins count")).toHaveTextContent("0");
    expect(screen.getByRole("status")).toHaveTextContent("X wins!");
    expect(getCell(0)).toHaveTextContent("X");
  });

  it("plays a human move and a computer response", () => {
    render(<App />);

    fireEvent.click(screen.getByLabelText("Computer"));
    clickCell(0);

    expect(getCell(0)).toHaveTextContent("X");
    expect(getCell(4)).toHaveTextContent("O");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Your turn (X)",
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("does not let the computer move after a human win", () => {
    render(<App />);

    fireEvent.click(screen.getByLabelText("Computer"));
    playMoves([0, 7, 6, 8]);

    expect(screen.getByRole("status")).toHaveTextContent("X wins!");
    expect(getCell(6)).toHaveClass("game-cell--winning");
    expect(getCell(7)).toHaveClass("game-cell--winning");
    expect(getCell(8)).toHaveClass("game-cell--winning");
    expect(screen.getAllByRole("listitem")).toHaveLength(7);
    expect(getScore("X wins count")).toHaveTextContent("1");
  });

  it("undoes the latest human/computer pair", () => {
    render(<App />);

    fireEvent.click(screen.getByLabelText("Computer"));
    clickCell(0);
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));

    expect(getCell(0)).toBeEmptyDOMElement();
    expect(getCell(4)).toBeEmptyDOMElement();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Your turn (X)",
    );
    expect(screen.getByText("No moves yet.")).toBeInTheDocument();
  });

  it("prevents duplicate moves from rapid clicks", () => {
    render(<App />);

    fireEvent.click(screen.getByLabelText("Computer"));
    clickCell(0);
    clickCell(0);

    expect(getCell(0)).toHaveTextContent("X");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("resets the active board when switching modes", () => {
    render(<App />);

    playMoves([0, 3, 1, 4, 2]);
    fireEvent.click(screen.getByLabelText("Computer"));

    expect(getCell(0)).toBeEmptyDOMElement();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Your turn (X)",
    );
    expect(screen.getByText("No moves yet.")).toBeInTheDocument();
    expect(getScore("X wins count")).toHaveTextContent("1");
  });

  it("preserves the selected mode when resetting the game", () => {
    render(<App />);

    fireEvent.click(screen.getByLabelText("Computer"));
    clickCell(0);
    fireEvent.click(
      screen.getByRole("button", { name: "Reset Game" }),
    );

    expect(screen.getByLabelText("Computer")).toBeChecked();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Your turn (X)",
    );
    expect(getCell(0)).toBeEmptyDOMElement();
    expect(getCell(4)).toBeEmptyDOMElement();
  });
});
