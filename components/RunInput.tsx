import React, { useState, FormEvent, useEffect } from "react";
import fetch from "isomorphic-unfetch";

const Machines = ["NS500668", "NB501484"];

interface RunInputProps {
  basePath: string;
  latestBCLID: number;
}

const RunInput = ({ basePath, latestBCLID }: RunInputProps) => {
  const [machineName, setmachineName] = useState(Machines[0]);
  const [selectedDate, setSelecteDate] = useState(new Date());
  const [file, setFile] = useState<File>(null);
  const [error, setError] = useState(false);
  const [runIndex, setRunIndex] = useState(latestBCLID);
  const createRunName = (date: Date, machine: string, index: number) => {
    if (!date) {
      return;
    }
    const year = date
      .getFullYear()
      .toString()
      .substring(2);
    let day = (date.getDate() + 1).toString();
    if (day.length < 2) {
      day = `0${day}`;
    }
    let month = (date.getMonth() + 1).toString();
    if (month.length < 2) {
      month = `0${month}`;
    }
    let indexString = index.toString();
    while (indexString.length < 4) {
      indexString = "0" + indexString;
    }
    const datePart = `${year}${month}${day}`;
    return `${datePart}_${machine}_${indexString}_XXXXXXXXXX`;
  };
  const [runName, setRunName] = useState("");

  useEffect(() => {
    updateRunName();
  }, [selectedDate, machineName, runIndex]);

  const updateRunName = () => {
    setRunName(createRunName(selectedDate, machineName, runIndex));
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!machineName || !selectedDate) {
      return;
    }
    if (runIndex < 100) {
      return;
    }
    const resp = await fetch(`${basePath}/api/newrun`, {
      method: "POST",
      body: JSON.stringify({ RunName: runName, index: runIndex })
    });
    if (resp.status !== 200) {
      setError(true);
      return;
    }
    if (file) {
      const formData = new FormData();
      formData.append("sample", file);
      formData.append("runName", runName);
      const fileResp = await fetch(`${basePath}/upload`, {
        method: "POST",
        body: formData
      });
      if (fileResp.status !== 200) {
        setError(true);
        return;
      }
    }
    location.reload();
  };

  return (
    <div className="card" style={{ textAlign: "center", height: "100%" }}>
      <div className="card-header has-background-grey">
        <div className="has-text-white card-header-title">Set a New Run</div>
      </div>
      <div style={{ paddingTop: "15px" }} className="card-content">
        <p>Use these fields to estimate a BCL folder name.</p>
      </div>
      <div className="card-footer">
        <form
          onSubmit={submit}
          style={{ margin: "2% 2%", textAlign: "left", width: "100%" }}
          action="/"
          method="post"
        >
          <p style={{ margin: "2%", textAlign: "center" }}>
            new run name: <b>{runName}</b>
          </p>
          <table
            className="table"
            style={{
              margin: "auto",
              width: "auto"
            }}
          >
            <tbody>
              <tr>
                <td>
                  <label>Run Date:</label>
                </td>
                <td>
                  <input
                    className="input date"
                    type="date"
                    onChange={({ target: { value } }) => {
                      if (!value) {
                        return;
                      }
                      setSelecteDate(new Date(value));
                    }}
                    name="fileName"
                    style={{ width: "150px", fontSize: "12px" }}
                    value={selectedDate?.toISOString().substr(0, 10)}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Machine ID:</label>
                </td>
                <td>
                  <select
                    className="select"
                    style={{ width: "150px" }}
                    value={machineName}
                    onChange={e => {
                      setmachineName(e.target.value);
                    }}
                    name="machine-select"
                    id="machine-select"
                  >
                    {Machines.map(machine => (
                      <option key={machine} value={machine}>
                        {machine}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <label>Run Index:</label>
                </td>
                <td>
                  <input
                    type="text"
                    style={{ height: "2rem", width: "150px" }}
                    className={`input ${runIndex >= 100 ? null : "is-danger"}`}
                    value={runIndex}
                    onChange={e => {
                      const num = parseInt(e.target.value);
                      if (isNaN(num)) {
                        setRunIndex(0);
                      } else {
                        setRunIndex(num);
                      }
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ verticalAlign: "middle" }}>
                  <label>Sample Sheet upload</label>
                </td>
                <td>
                  {!file ? (
                    <div
                      style={{ textAlign: "center", alignItems: "center" }}
                      className="is-small file"
                    >
                      <label style={{ margin: "auto" }} className="file-label">
                        <input
                          onChange={e => setFile(e.target.files[0])}
                          className="file-input"
                          type="file"
                          name="resume"
                        />
                        <span className="file-cta">
                          <span className="file-label">Upload</span>
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: "12px" }}>✔ Uploaded</span>
                      <button
                        className="button is-small is-danger"
                        style={{ fontSize: "12px", marginLeft: "5px" }}
                        onClick={e => {
                          e.preventDefault();
                          setFile(null);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{ textAlign: "center" }}>
            <input className="button is-success" type="submit" value="submit" />
          </div>
        </form>
      </div>
      {error && (
        <div style={{ margin: "1% auto" }}>
          <p style={{ color: "red" }}>
            There was an error setting the current run.
          </p>
        </div>
      )}
      <style jsx>{`
        .table > * {
          padding: 0 2%;
        }
      `}</style>
    </div>
  );
};

export default RunInput;
