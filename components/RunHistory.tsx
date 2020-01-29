import React, { useState } from "react";
import Run from "../server/models/Run";
import RunCard from "./RunCard";
import fetch from "isomorphic-unfetch";

interface RunHistoryProps {
  runs: Run[];
}

const RunHistory = ({ runs }: RunHistoryProps) => {
  const [properRuns, setRuns] = useState(runs);

  const reload = async () => {
    const res = await fetch("/api/runhistory");
    const json = await res.json();
    setRuns(json as Run[]);
  };

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
              onClick={reload}
              style={{ float: "right" }}
              className="button is-info"
            >
              Reload
            </button>
          </div>
        </div>
        <div className="card-content">
          {!!properRuns.length ? (
            properRuns.map(run => <RunCard run={run} key={run._id} />)
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
