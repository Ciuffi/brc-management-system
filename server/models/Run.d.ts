interface Run {
  LabName?: string;
  RunName?: string;
  _id?: string;
  RunStatus?:
    | "Created"
    | "BeginRun"
    | "EndRun"
    | "BeginBCL2FASTQ"
    | "EndBCL2FASTQ"
    | "BeginAnalysis"
    | "EndAnalysis";
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
