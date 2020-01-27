import React, { useState } from "react";

const RunInput = () => {
  const response = "error";
  const [runName, setRunName] = useState("");
  return (
    <div
      className="card"
      style={{ textAlign: "center", width: "30vw", margin: "4% auto" }}
    >
      <div className="card-header has-background-grey">
        <div className="has-text-white card-header-title">Set a new run</div>
      </div>
      <div className="card-content">
        <p>Input the name of the sample in the current run</p>
      </div>
      <div className="card-footer">
        <form
          style={{ display: "flex", margin: "2% auto;" }}
          action="/"
          method="post"
        >
          <input
            className="input is-success"
            type="text"
            onChange={({ target: { value } }) => setRunName(value)}
            name="fileName"
            placeholder="run name"
            value={runName}
          />
          <input className="button is-success" type="submit" value="submit" />
        </form>
      </div>
      {!!response && (
        <div style={{ margin: "1% auto" }}>
          <p style={{ color: response === "error" ? "red" : "green" }}>
            {response === "error"
              ? "There was an error setting the current run."
              : "Current run set successfully!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default RunInput;
