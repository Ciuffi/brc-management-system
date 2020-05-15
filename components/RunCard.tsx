import React, { useState } from "react";
import Run, { StatusToText } from "../server/models/Run";
interface RunCardProps {
  run: Run;
  reload: () => any;
  basePath: string;
}

const RunCard = ({
  run: {
    AnalysisStartedOn: AnalysisStartTime,
    RunName,
    Error,
    CreatedOn: CreatedTime,
    RunFinishedOn: RunFinishedTime,
    BCLFolderPath,
    _id,
    SampleSheetPath,
    RunStatus,
    RunStartedOn,
    BCL2FASTQFinishedOn,
    BCL2FASTQStartedOn,
    AnalysisFinishedOn
  },
  reload,
  basePath
}: RunCardProps) => {
  const RunFinished = RunStatus === "EndRun";
  const [CardShown, SetCardShown] = useState(false);
  const deleteRun = async (id: string) => {
    const res = await fetch(`${basePath}/api/deleterun`, {
      method: "POST",
      body: JSON.stringify({ RunID: id })
    });
    await reload();
  };
  const uploadSampleSheet = async (file: File) => {
    if (file) {
      const formData = new FormData();
      formData.append("sample", file);
      formData.append("runName", RunName);
      const fileResp = await fetch(`${basePath}/upload`, {
        method: "POST",
        body: formData
      });
      if (fileResp.status !== 200) {
        return;
      }
    }
    await reload();
  };
  return (
    <div
      style={{ marginBottom: "20px" }}
      className={`message ${RunFinished ? "is-success" : ""} ${
        RunStatus !== "EndAnalysis" && !Error ? "is-warning" : ""
      } ${Error ? "is-danger" : ""}`}
    >
      <div onClick={() => SetCardShown(!CardShown)} className="message-header">
        Name: {RunName}{" "}
        <span style={{ textAlign: "left", color: "blue", fontSize: "12px" }}>
          {CardShown ? "Click to Hide Details" : "Click to Show Details"}
        </span>
        {!Error ? <p>Status: {StatusToText(RunStatus)}</p> : <p> Error!</p>}
      </div>
      <div
        style={{ display: CardShown ? "inherit" : "none", textAlign: "left" }}
        className="message-body"
      >
        <p>
          <b>Run Inputted on:</b>{" "}
          <span style={{ color: "green" }}>
            {new Date(CreatedTime).toLocaleString("en-US")}{" "}
          </span>
        </p>
        <p>
          <b>Run Started at: </b>
          {RunStartedOn ? (
            <span style={{ color: "green" }}>
              {new Date(RunStartedOn).toLocaleString("en-US")}
            </span>
          ) : (
            "unfinished"
          )}
        </p>
        <p>
          <b>Run finished at: </b>
          {RunFinishedTime ? (
            <span style={{ color: "green" }}>
              {new Date(RunFinishedTime).toLocaleString("en-US")}
            </span>
          ) : (
            "unfinished"
          )}
        </p>
        <p>
          <b>BCL2FASTQ started at: </b>
          {BCL2FASTQStartedOn ? (
            <span style={{ color: "green" }}>
              {new Date(BCL2FASTQStartedOn).toLocaleString("en-US")}
            </span>
          ) : (
            "unfinished"
          )}
        </p>
        <p>
          <b>BCL2FASTQ finished at: </b>
          {BCL2FASTQFinishedOn ? (
            <span style={{ color: "green" }}>
              {new Date(BCL2FASTQFinishedOn).toLocaleString("en-US")}
            </span>
          ) : (
            "unfinished"
          )}
        </p>
        <p>
          <b>Analysis started at: </b>
          {AnalysisStartTime ? (
            <span style={{ color: "green" }}>
              new Date(AnalysisStartTime).toLocaleString("en-US"){" "}
            </span>
          ) : (
            "unfinished"
          )}
        </p>
        <p>
          <b>Analysis finished at: </b>
          {AnalysisFinishedOn ? (
            <span style={{ color: "green" }}>
              new Date(AnalysisFinishedOn).toLocaleString("en-US"){" "}
            </span>
          ) : (
            "unfinished"
          )}
        </p>
        <hr style={{ margin: 0, border: "1px solid red" }} />
        <div style={{ margin: 0, alignItems: "center" }} className="file">
          <p>
            <b>sample sheet:</b> {SampleSheetPath ? "✔" : "❌"} Sample sheet
            provided
          </p>
          <label style={{ marginLeft: "2%" }} className="file-label">
            <input
              onChange={e => uploadSampleSheet(e.target.files[0])}
              className="file-input"
              type="file"
              name="resume"
            />
            <span className="file-cta">
              <span style={{ fontSize: "1rem" }} className="file-label">
                {SampleSheetPath ? "Reupload" : "Upload"}{" "}
              </span>
            </span>
          </label>
        </div>
        {BCLFolderPath ? (
          <div>
            <b>BCL folder path:</b> {BCLFolderPath}
          </div>
        ) : null}
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <button onClick={() => deleteRun(_id)} className="button is-danger">
            Delete Run
          </button>
        </div>
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
