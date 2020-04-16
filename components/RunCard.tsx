import React, { useState } from "react";
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
    BCLFolderPath
  }
}: RunCardProps) => {
  const [CardShown, SetCardShown] = useState(false);
  return (
    <div
      className={`message ${RunFinished ? "is-success" : ""} ${
        !RunFinished && !Error ? "is-warning" : ""
      } ${Error ? "is-danger" : ""}`}
    >
      <div onClick={() => SetCardShown(!CardShown)} className="message-header">
        Name: {RunName}{" "}
        <span style={{ textAlign: "left", color: "blue", fontSize: "12px" }}>
          {CardShown ? "Click to Hide Details" : "Click to Show Details"}
        </span>
        {!Error ? (
          <p>processed: {RunFinished ? "yes" : "no"}</p>
        ) : (
          <p> Error!</p>
        )}
      </div>
      <div
        style={{ display: CardShown ? "inherit" : "none", textAlign: "left" }}
        className="message-body"
      >
        <p>
          <b>Run started on:</b> {new Date(CreatedTime).toLocaleString("en-US")}
        </p>
        <p>
          <b>Run finished at: </b>{" "}
          {RunFinishedTime
            ? new Date(RunFinishedTime).toLocaleString("en-US")
            : "unfinished"}
        </p>
        {BCLFolderPath ? (
          <div>
            <b>BCL folder path:</b>{" "}
            <a
              href={`/bms/bms/bcl/${BCLFolderPath.substr(
                "/brcwork/sequence/bcl/".length
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {BCLFolderPath}
            </a>
          </div>
        ) : null}
        <p>
          <b>Pipeline started on: </b>{" "}
          {AnalysisStartTime
            ? new Date(AnalysisStartTime).toLocaleString("en-US")
            : "unfinished"}
        </p>
      </div>
      <style jsx>{`
        .bclPath {
          margin-left: 2%;
        }
      `}</style>
    </div>
  );
};

export default RunCard;
