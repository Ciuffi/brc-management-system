interface Run {
  //Identifier information
  LabName: string;
  RunName: string;
  _id?: number;
  //Pipeline stage information
  RunFinished?: boolean;
  AnalysisFinished?: boolean;
  Error: boolean;
  //stats information
  CreatedTime: string;
  AnalysisStartTime?: string;
  RunFinishedTime?: string;
  AnalysisFinishedTime?: string;
  //File locations
  BCLFolderPath?: string;
  BCLFilePaths?: string[];
  FASTQFolderPath?: string;
  FASTQFilePaths?: string[];
}
export default Run;
