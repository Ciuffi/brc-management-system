export const StatusToText = (status: runStatus) => {
  switch (status) {
    case "Created":
      return "Waiting for run to start";
    case "BeginRun":
      return "Run in progress";
    case "BeginBCL2FASTQ":
      return "BCL2FASTQ in progress";
    case "BeginAnalysis":
      return "Analysis in progress";
    case "EndAnalysis":
      return "Run completed and analylized!";
    case "EndRun":
      return "Waiting for samplesheet";
    case "EndBCL2FASTQ":
      return "Waiting on analysis to start";
  }
};

export type runStatus =
  | "Created"
  | "BeginRun"
  | "EndRun"
  | "BeginBCL2FASTQ"
  | "EndBCL2FASTQ"
  | "BeginAnalysis"
  | "EndAnalysis";

interface Run {
  LabName?: string;
  RunName?: string;
  _id?: string;
  RunStatus?: runStatus;
  Error?: boolean;
  CreatedOn?: string;
  RunStartedOn?: string;
  RunFinishedOn?: string;
  BCL2FASTQStartedOn?: string;
  BCL2FASTQFinishedOn?: string;
  AnalysisStartedOn?: string;
  AnalysisFinishedOn?: string;
  BCLFolderPath?: string;
  FASTQFolderPath?: string;
  SampleSheetPath?: string;
}
export default Run;
