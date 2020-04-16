import React, { useState } from "react";
import Run from "../server/models/Run";
import RunCard from "./RunCard";
import fetch from "isomorphic-unfetch";

interface RunHistoryProps {
  runs: Run[];
  basePath: string;
}

const RunHistory = ({ basePath, runs }: RunHistoryProps) => {
  const [properRuns, setRuns] = useState(runs);

  const reload = async () => {
    const res = await fetch(`${basePath}/api/runhistory`);
    const json = await res.json();
    setRuns(json as Run[]);
  };

  const filterRuns = (query: string) => {
    const filteredRuns: Run[] = runs.filter((run: Run) => {
      return Object.values(run).some((val: string) => {
        return String(val)
          .toLowerCase()
          .includes(query.toLowerCase());
      });
    });
    setRuns(query ? filteredRuns : runs);
  };

  return (
    <div>
      <div className="history card" style={{ textAlign: "center" }}>
        <div className="card-header has-background-grey">
          <div
            style={{ width: "100%", display: "inline" }}
            className="has-text-white card-header-title"
          >
            <p style={{ float: "left", fontSize: "1.5em" }}>Run History</p>
            <input
              className="input searchBox"
              onChange={e => filterRuns(e.target.value)}
              placeholder="Filter Runs"
            />
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
        .searchBox {
          width: 40%;
          height: 70%;
          margin-top: 5px;
        }
        ::placeholder {
          color: darkGrey;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};
export default RunHistory;
