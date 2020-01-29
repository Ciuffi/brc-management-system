import React, { useState, FormEvent } from "react";
import fetch from "isomorphic-unfetch";
const RunInput = () => {
  const [runName, setRunName] = useState("");
  const [error, setError] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (runName === "") {
      return;
    }
    const resp = await fetch("/api/newrun", {
      method: "POST",
      body: JSON.stringify({ RunName: runName })
    });
    if (resp.status === 200) {
      window.location.reload();
    } else {
      setError(true);
    }
  };

  return (
    <div className="card" style={{ textAlign: "center", height: "100%" }}>
      <div className="card-header has-background-grey">
        <div className="has-text-white card-header-title">Set a new run</div>
      </div>
      <div className="card-content">
        <p>Input the name of the sample in the current run</p>
      </div>
      <div className="card-footer">
        <form
          onSubmit={submit}
          style={{ margin: "2% auto" }}
          action="/"
          method="post"
          className="is-flex-tablet"
        >
          <input
            className="input is-success"
            type="text"
            onChange={({ target: { value } }) => setRunName(value)}
            name="fileName"
            placeholder="run name"
            style={{ maxWidth: "80%" }}
            value={runName}
          />
          <input className="button is-success" type="submit" value="submit" />
        </form>
      </div>
      {error && (
        <div style={{ margin: "1% auto" }}>
          <p style={{ color: "red" }}>
            There was an error setting the current run.
          </p>
        </div>
      )}
    </div>
  );
};

export default RunInput;
