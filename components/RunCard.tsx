import React from "react";
import Run from "../server/models/Run";
interface RunCardProps {
  run: Run;
}
const RunCard = ({
  run: {
    AnalysisStartTime,
    RunName,
    Error,
    RunFinished,
    CreatedTime,
    RunFinishedTime
  }
}: RunCardProps) => (
  <div
    className={`message ${RunFinished ? "is-success" : ""} ${
      !RunFinished && !Error ? "is-warning" : ""
    } ${Error ? "is-danger" : ""}`}
  >
    <div className="message-header">
      Name: {RunName}
      {Error ? <p>processed: {RunFinished ? "yes" : "no"}</p> : <p> Error!</p>}
    </div>
    <div style={{ textAlign: "left" }} className="message-body">
      <p>
        <b>Started on:</b> {new Date(CreatedTime).toISOString()}
      </p>
      <p>
        <b>Run finished at: </b>{" "}
        {RunFinishedTime
          ? new Date(RunFinishedTime).toISOString()
          : "unfinished"}
      </p>
      <p>
        <b>Pipeline started on: </b>{" "}
        {AnalysisStartTime
          ? new Date(AnalysisStartTime).toISOString()
          : "unfinished"}
      </p>
    </div>
  </div>
);

export default RunCard;
