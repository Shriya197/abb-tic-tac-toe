function MoveHistory({ moveHistory }) {
  return (
    <section className="history" aria-labelledby="history-title">
      <h2 id="history-title">Move history</h2>

      {moveHistory.length === 0 ? (
        <p className="empty-state">No moves yet.</p>
      ) : (
        <ol className="history-list">
          {moveHistory.map((move, index) => {
            const moveNumber = index + 1;
            const row = Math.floor(move.index / 3) + 1;
            const column = (move.index % 3) + 1;

            return (
              <li key={`${move.index}`}>
                Move {moveNumber}: {move.player} at Row {row}, Column {column}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

export default MoveHistory;
