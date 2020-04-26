import { Db, Collection, UpdateWriteOpResult } from "mongodb";
import Run from "./models/Run";
declare class dbHandler {
  db: Db;
  collection: Collection;
  initialize: () => Promise<void>;
  GetRunHistory: () => Promise<Run[]>;
  InsertNewRun: (
    labName: string,
    runName: string,
    runFinished: boolean,
    error: boolean
  ) => Promise<void>;
  GetLatestRun: () => Promise<Run>;
  updateRun: (id: string, updates: any) => Promise<UpdateWriteOpResult>;
}
export default dbHandler;
