import Run, { StatusToText } from "../server/models/Run";

const RunStats = ({
  RunName,
  Error,
  RunStatus,
  RunFinishedOn: RunFinishedTime,
  AnalysisFinishedOn,
  BCL2FASTQFinishedOn,
  SampleSheetPath
}: Run) => {
  const RunFinished = !!RunFinishedTime;
  const AnalysisFinished = !!AnalysisFinishedOn;
  const BCL2FASTQFinished = !!BCL2FASTQFinishedOn;
  return (
    <div className="card" style={{ height: "100%" }}>
      <div className="card-header has-background-grey">
        <div className="has-text-white card-header-title">
          Current Run Statistics
        </div>
      </div>
      <div style={{ paddingTop: "15px" }} className="card-content">
        <p style={{ textAlign: "center", fontSize: "18px", marginTop: "0" }}>
          Current run: <b>{RunName ?? "No current runs"}</b>
        </p>
        <p style={{ textAlign: "center", fontSize: "18px", marginTop: "0" }}>
          {Error ? (
            <span style={{ color: "red" }}> ⚠Something went wrong⚠</span>
          ) : RunStatus ? (
            `Run Status: ${StatusToText(RunStatus)}`
          ) : null}
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

          <p>
            {BCL2FASTQFinished ? "✔" : "❌"} BCL2FASTQ Finished{" "}
            {BCL2FASTQFinishedOn && (
              <span style={{ color: "grey" }}>
                at {new Date(BCL2FASTQFinishedOn).toLocaleString("en-us")}
              </span>
            )}
          </p>

          <p>
            {" "}
            {AnalysisFinished ? "✔" : "❌"} Analysis Finished{" "}
            {AnalysisFinishedOn && (
              <span style={{ color: "grey" }}>
                at {new Date(AnalysisFinishedOn).toLocaleString("en-us")}
              </span>
            )}
          </p>

          <p>{SampleSheetPath ? "✔" : "❌"} Sample sheet provided</p>
          {Error && (
            <p
              style={{
                textAlign: "center",
                color: "red",
                fontSize: "20px"
              }}
            ></p>
          )}
        </div>
      </div>
    </div>
  );
};
export default RunStats;
