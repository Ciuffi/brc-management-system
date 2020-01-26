import React from "react";
import Run from "../server/models/Run";
const RunHistory = () => {
  const runs: Run[] = [];
  return (
    <div>
      <div
        className="history card"
        style={{ textAlign: "center", width: "80vw" }}
      >
        <div className="card-header has-background-grey">
          <div
            style={{ width: "100%", display: "inline" }}
            className="has-text-white card-header-title"
          >
            <p style={{ float: "left" }}>Run History</p>
            <button style={{ float: "right" }} className="button is-info">
              Reload
            </button>
          </div>
        </div>
      </div>
      <div className="card-content">
        {!!runs.length ? (
          <div>
            {runs.map(
              ({
                AnalysisStartTime,
                _id,
                RunName,
                Error,
                RunFinished,
                CreatedTime,
                RunFinishedTime
              }) => {
                <div
                  className={`message ${RunFinished ? "is-success" : ""} ${
                    !RunFinished && !Error ? "is-warning" : ""
                  } ${Error ? "is-danger" : ""}`}
                >
                  <div className="message-header">
                    Name: {RunName}
                    {Error ? (
                      <p>processed: {RunFinished ? "yes" : "no"}</p>
                    ) : (
                      <p> Error!</p>
                    )}
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
                </div>;
              }
            )}
          </div>
        ) : (
          <div>false</div>
        )}
      </div>
      <style jsx>{`
        .cards > * {
          margin: 4% auto;
        }
      `}</style>
    </div>
  );
};
export default RunHistory;