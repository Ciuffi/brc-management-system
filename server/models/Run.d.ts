interface Run {
  LabName?: string;
  RunName?: string;
  _id?: string;
  RunFinished?: boolean;
  AnalysisFinished?: boolean;
  Error?: boolean;
  CreatedTime?: string;
  AnalysisStartTime?: string;
  RunFinishedTime?: string;
  AnalysisFinishedTime?: string;
  BCLFolderPath?: string;
  BCLFilePaths?: string[];
  FASTQFolderPath?: string;
  FASTQFilePaths?: string[];
  SampleSheetPath?: string;
}
export default Run;
