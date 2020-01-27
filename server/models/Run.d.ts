interface Run {
    LabName: string;
    RunName: string;
    _id?: number;
    RunFinished?: boolean;
    AnalysisFinished?: boolean;
    Error: boolean;
    CreatedTime: string;
    AnalysisStartTime?: string;
    RunFinishedTime?: string;
    AnalysisFinishedTime?: string;
    BCLFolderPath?: string;
    BCLFilePaths?: string[];
    FASTQFolderPath?: string;
    FASTQFilePaths?: string[];
}
export default Run;
