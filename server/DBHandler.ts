import { MongoClient, Db, Collection, UpdateWriteOpResult } from "mongodb";
import Run from "./models/Run";
import { greenLog, redError } from "./Logging";
// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const DB_NAME = "brc";
const COLLECTION_NAME = "runs";

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });

class DbHandler {
  db: Db;
  collection: Collection;

  initialize = async () => {
    console.log("> connecting to database...");
    try {
      await client.connect();
    } catch (e) {
      redError(
        "> Could not connect to database. Please make sure its running and restart the server."
      );
      process.exit(1);
    }
    greenLog("> connected successfully to database!");
    this.db = client.db(DB_NAME);
    this.collection = this.db.collection(COLLECTION_NAME);
    await this.setWatcherStatus(true);
  };

  setWatcherStatus = async (on: boolean): Promise<void> => {
    await this.db.collection("status").updateOne(
      { _id: "watcher" },
      { $set: { _id: "watcher", on } },
      {
        upsert: true
      }
    );
  };

  getWatcherStatus = async (): Promise<boolean> => {
    const status = await this.db
      .collection("status")
      .findOne({ _id: "watcher" });
    return status.on;
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

  updateArray = async (id: number, array: string, element: string) => {
    return this.collection.updateOne(
      { _id: id },
      {
        $push: {
          [array]: element
        }
      }
    );
  };

  updateRun = async (
    id: number,
    updates: Run
  ): Promise<UpdateWriteOpResult> => {
    return this.collection.updateOne({ _id: id }, { $set: updates });
  };
}
export default DbHandler;
