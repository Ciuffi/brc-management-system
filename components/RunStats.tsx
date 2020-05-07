import Run from "../server/models/Run";

const RunStats = ({
  RunName,
  Error,
  RunStatus,
  RunFinishedOn: RunFinishedTime,
  AnalysisFinishedOn,
  BCL2FASTQFinishedOn,
  SampleSheetPath
}: Run) => {
  const RunFinished = RunStatus === "EndRun";
  const AnalysisFinished = RunStatus === "EndAnalysis";
  const BCL2FASTQFinished = RunStatus === "EndBCL2FASTQ";
  return (
    <div className="card" style={{ height: "100%" }}>
      <div className="card-header has-background-grey">
        <div className="has-text-white card-header-title">
          Current Run Statistics
        </div>
      </div>
      <div style={{ paddingTop: "15px" }} className="card-content">
        <p style={{ textAlign: "center", fontSize: "20px", marginTop: "0" }}>
          Current run: <b>{RunName ?? "No current runs"}</b>
        </p>
        <div style={{ marginLeft: "5px", marginTop: "5px" }}>
          <p>{RunFinished ? "✔" : "❌"} Sequencer Finished </p>
          {RunFinishedTime && (
            <span style={{ color: "grey" }}>
              at {new Date(RunFinishedTime).toLocaleString("en-us")}
            </span>
          )}
          <p> {BCL2FASTQFinished ? "✔" : "❌"} BCL2FASTQ Finished</p>
          {BCL2FASTQFinishedOn && (
            <span style={{ color: "grey" }}>
              at {new Date(BCL2FASTQFinishedOn).toLocaleString("en-us")}
            </span>
          )}
          <p> {AnalysisFinished ? "✔" : "❌"} Analysis Finished</p>
          {AnalysisFinishedOn && (
            <span style={{ color: "grey" }}>
              at {new Date(AnalysisFinishedOn).toLocaleString("en-us")}
            </span>
          )}

          <p>{SampleSheetPath ? "✔" : "❌"} Sample sheet provided</p>
          {Error && <p style={{ color: "red" }}>❌Something went wrong...❌</p>}
        </div>
      </div>
    </div>
  );
};
export default RunStats;
