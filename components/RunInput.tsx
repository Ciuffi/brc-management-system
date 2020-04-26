import React, { useState, FormEvent } from "react";
import fetch from "isomorphic-unfetch";

const Machines = ["NS500668", "NB501484"];

interface RunInputProps {
  basePath: string;
  latestBCLID: number;
}

const RunInput = ({ basePath, latestBCLID }: RunInputProps) => {
  const [machineName, setmachineName] = useState(Machines[0]);
  const [selectedDate, setSelecteDate] = useState(new Date());
  const [error, setError] = useState(false);
  const createRunName = (date: Date, machine: string, index: number) => {
    const year = date
      .getFullYear()
      .toString()
      .substring(2);
    let day = date.getDate().toString();
    console.log(day);
    if (day.length < 2) {
      day = `0${day}`;
    }
    if (day.length < 2) {
      day = `0${day}`;
    }
    let month = (date.getMonth() + 1).toString();
    console.log(month);
    if (month.length < 2) {
      month = `0${month}`;
    }
    const datePart = `${year}${month}${day}`;
    return `${datePart}_${machine}_${index}_XXXXXXXXXX`;
  };
  const [runName, setRunName] = useState(
    createRunName(selectedDate, machineName, latestBCLID)
  );

  const updateRunName = () => {
    setRunName(createRunName(selectedDate, machineName, latestBCLID));
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!machineName || !selectedDate) {
      return;
    }
    const resp = await fetch(`${basePath}/api/newrun`, {
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
        <div className="has-text-white card-header-title">Set a New Run</div>
      </div>
      <div style={{ paddingTop: "15px" }} className="card-content">
        <p>Input the name of the sample in the current run</p>
      </div>
      <div className="card-footer">
        <form
          onSubmit={submit}
          style={{ margin: "2% 2%", textAlign: "left", width: "100%" }}
          action="/"
          method="post"
        >
          <p style={{ margin: "2%", textAlign: "center" }}>
            Current run name: <b>{runName}</b>
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
                      setSelecteDate(new Date(value));
                      updateRunName();
                    }}
                    name="fileName"
                    style={{ width: "150px", fontSize: "12px" }}
                    value={selectedDate.toISOString().substr(0, 10)}
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
                      updateRunName();
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
