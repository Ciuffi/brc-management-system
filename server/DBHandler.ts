import { MongoClient, Db, Collection, UpdateWriteOpResult } from "mongodb";
import Run from "./models/Run";
// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const DB_NAME = "brc";
const COLLECTION_NAME = "runs";

// Create a new MongoClient
const client = new MongoClient(url);

class dbHandler {
  db: Db;
  collection: Collection;

  initialize = async () => {
    await client.connect();
    this.db = client.db(DB_NAME);
    this.collection = this.db.collection(COLLECTION_NAME);
  };

  GetRunHistory = async (): Promise<Run[]> => {
    return await this.collection
      .find({})
      .sort({ _id: -1 })
      .toArray();
  };

  InsertNewRun = async (
    labName: string,
    runName: string,
    runFinished: boolean,
    error: boolean
  ): Promise<void> => {
    this.collection.insertOne({
      LabName: labName,
      RunName: runName,
      RunFinished: runFinished,
      Error: error,
      CreatedTime: new Date().toISOString()
    });
  };

  GetLatestRun = async (): Promise<Run> => {
    return this.collection
      .find({})
      .sort({ _id: -1 })
      .limit(1)
      .next();
  };

  updateRun = async (
    id: number,
    updates: any
  ): Promise<UpdateWriteOpResult> => {
    return this.collection.updateOne({ _id: id }, updates);
  };
}
export default dbHandler;
