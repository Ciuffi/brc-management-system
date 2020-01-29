import React from "react";
import Run from "../server/models/Run";
import RunCard from "./RunCard";

interface RunHistoryProps {
  runs: Run[];
}

const RunHistory = ({ runs }: RunHistoryProps) => {
  return (
    <div>
      <div className="history card" style={{ textAlign: "center" }}>
        <div className="card-header has-background-grey">
          <div
            style={{ width: "100%", display: "inline" }}
            className="has-text-white card-header-title"
          >
            <p style={{ float: "left" }}>Run History</p>
            <button
              onClick={() => window.location.reload()}
              style={{ float: "right" }}
              className="button is-info"
            >
              Reload
            </button>
          </div>
        </div>
        <div className="card-content">
          {!!runs.length ? (
            runs.map(run => <RunCard run={run} key={run._id} />)
          ) : (
            <h1>Currently No Runs </h1>
          )}
        </div>
      </div>

      <style jsx>{`
        .history {
          margin: auto;
        }
      `}</style>
    </div>
  );
};
export default RunHistory;
