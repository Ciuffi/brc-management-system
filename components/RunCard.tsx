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
    RunFinishedTime,
    BCLFilePaths,
    BCLFolderPath
  }
}: RunCardProps) => (
  <div
    className={`message ${RunFinished ? "is-success" : ""} ${
      !RunFinished && !Error ? "is-warning" : ""
    } ${Error ? "is-danger" : ""}`}
  >
    <div className="message-header">
      Name: {RunName}
      {!Error ? <p>processed: {RunFinished ? "yes" : "no"}</p> : <p> Error!</p>}
    </div>
    <div style={{ textAlign: "left" }} className="message-body">
      <p>
        <b>Started on:</b> {new Date(CreatedTime).toLocaleString("en-US")}
      </p>
      <p>
        <b>Run finished at: </b>{" "}
        {RunFinishedTime
          ? new Date(RunFinishedTime).toLocaleString("en-US")
          : "unfinished"}
      </p>
      <p>
        <b>Pipeline started on: </b>{" "}
        {AnalysisStartTime
          ? new Date(AnalysisStartTime).toLocaleString("en-US")
          : "unfinished"}
      </p>
      {BCLFolderPath ? (
        <div>
          <b>BCL folder path:</b>{" "}
          <a
            href={`/bcl/${BCLFolderPath.substr(
              "/brcwork/sequence/bcl/".length
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          ></a>{" "}
          {BCLFolderPath}
        </div>
      ) : null}
    </div>
    <style jsx>{`
      .bclPath {
        margin-left: 2%;
      }
    `}</style>
  </div>
);

export default RunCard;
