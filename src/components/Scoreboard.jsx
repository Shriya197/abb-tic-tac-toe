function Scoreboard({ scoreboard }) {
  return (
    <section className="scoreboard" aria-labelledby="scoreboard-title">
      <h2 id="scoreboard-title">Scoreboard</h2>

      <dl className="score-list">
        <div>
          <dt>X wins</dt>
          <dd aria-label="X wins count">{scoreboard.X}</dd>
        </div>
        <div>
          <dt>O wins</dt>
          <dd aria-label="O wins count">{scoreboard.O}</dd>
        </div>
        <div>
          <dt>Draws</dt>
          <dd aria-label="Draw count">{scoreboard.draws}</dd>
        </div>
      </dl>
    </section>
  );
}

export default Scoreboard;
