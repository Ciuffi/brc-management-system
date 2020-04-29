import Run from "../server/models/Run";

const RunStats = ({
  RunName,
  Error,
  RunFinished,
  AnalysisFinished,
  RunFinishedTime,
  SampleSheetPath
}: Run) => {
  return (
    <div className="card" style={{ height: "100%" }}>
      <div className="card-header has-background-grey">
        <div className="has-text-white card-header-title">
          Current Run Statistics
        </div>
      </div>
      <div style={{ paddingTop: "15px" }} className="card-content">
        <p style={{ textAlign: "center", fontSize: "20px", marginTop: "0" }}>
          Current run: <b>{RunName}</b>
        </p>
        <div style={{ marginLeft: "5px", marginTop: "5px" }}>
          <p>
            {RunFinished ? "✔" : "❌"} Sequencer Finished{" "}
            {RunFinishedTime && (
              <span style={{ color: "grey" }}>
                at {new Date(RunFinishedTime).toLocaleString("en-us")}
              </span>
            )}
          </p>
          <p> {AnalysisFinished ? "✔" : "❌"} Analysis Finished</p>
          <p>{SampleSheetPath ? "✔" : "❌"} Sample sheet provided</p>
          {Error && <p style={{ color: "red" }}>❌Something went wrong...❌</p>}
        </div>
      </div>
    </div>
  );
};
export default RunStats;
