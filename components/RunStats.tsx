import Run from "../server/models/Run";

const RunStats = ({ RunName, Error, RunFinished }: Run) => {
  return (
    <div
      className="card"
      style={{ textAlign: "center", width: "30vw", margin: "4% auto" }}
    >
      <div className="card-header has-background-grey">
        <div className="has-text-white card-header-title">
          Current Run Statistics
        </div>
      </div>
      <div className="card-content">
        <p>Current run name: {RunName}</p>
        {RunFinished ? (
          <p style={{ color: "green" }}>This run has been processed!</p>
        ) : (
          <p style={{ color: "orange" }}>This file has not been processed</p>
        )}
        {Error && (
          <p style={{ color: "red" }}>
            Something went wrong.. Please check the stacktrace.
          </p>
        )}
      </div>
    </div>
  );
};
export default RunStats;
