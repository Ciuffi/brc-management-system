import React, { useState } from "react";
import Run from "../server/models/Run";
interface RunCardProps {
  run: Run;
  reload: () => any;
  basePath: string;
}
const RunCard = ({
  run: {
    AnalysisStartTime,
    RunName,
    Error,
    RunFinished,
    CreatedTime,
    RunFinishedTime,
    BCLFolderPath,
    _id,
    SampleSheetPath
  },
  reload,
  basePath
}: RunCardProps) => {
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

        <div style={{ alignItems: "center" }} className="file">
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
              <span className="file-label">
                {SampleSheetPath ? "Reupload" : "Upload"}{" "}
              </span>
            </span>
          </label>
        </div>
        <p>
          <b>Run finished at: </b>{" "}
          {RunFinishedTime
            ? new Date(RunFinishedTime).toLocaleString("en-US")
            : "unfinished"}
        </p>
        {BCLFolderPath ? (
          <div>
            <b>BCL folder path:</b> {BCLFolderPath}
          </div>
        ) : null}
        <p>
          <b>Pipeline started on: </b>{" "}
          {AnalysisStartTime
            ? new Date(AnalysisStartTime).toLocaleString("en-US")
            : "unfinished"}
        </p>
        <div style={{ textAlign: "center" }}>
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
