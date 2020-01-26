interface Run {
    //Identifier information
    LabName: string;
    RunName: string;
    //Pipeline stage information
    RunFinished: boolean;
    AnalysisFinished?: boolean;
    Error: boolean;
    //stats information
    CreatedTime: string;
    RunFinishedTime?: string;
    AnalysisFinishedTime?: string;
    //File locations
    BCLFolderPath?: string;
    BCLFilePaths?: string[];
    FASTQFolderPath?: string;
    FASTQFilePaths?: string[];
}
export default Run;
