import {
  MongoClient,
  Db,
  Collection,
  UpdateWriteOpResult,
  DeleteWriteOpResultObject,
  ObjectID
} from "mongodb";
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

  updateBCLID = async (index): Promise<UpdateWriteOpResult> => {
    return this.db.collection("status").updateOne(
      { _id: "BCLID" },
      {
        $set: { index: index + 1 }
      }
    );
  };
  getLatestBCLID = async (): Promise<number> => {
    return (await this.db.collection("status").findOne({ _id: "BCLID" })).index;
  };

  GetRunHistory = async (): Promise<Run[]> => {
    return await this.collection
      .find({})
      .sort({ _id: -1 })
      .toArray();
  };

  InsertNewRun = async (
    labName: string,
    index: number,
    runName: string,
    runFinished: boolean,
    error: boolean
  ): Promise<void> => {
    const newRun: Run = {
      LabName: labName,
      RunName: runName,
      RunStatus: "Created",
      Error: error,
      CreatedOn: new Date().toISOString()
    };
    await this.collection.insertOne(newRun);
    await this.updateBCLID(index);
  };

  DeleteRun = async (id: string): Promise<DeleteWriteOpResultObject> => {
    return this.collection.deleteOne({ _id: new ObjectID(id) });
  };
  GetLatestRun = async (): Promise<Run> => {
    return this.collection
      .find({})
      .sort({ _id: -1 })
      .limit(1)
      .next();
  };

  GetRun = async (name: string): Promise<Run> => {
    return this.collection.findOne({ RunName: name });
  };
  GetRunByBCLPath = async (path: string): Promise<Run> => {
    let query: Run = {
      BCLFolderPath: path
    };
    return this.collection.findOne(query);
  };

  GetRunByID = async (_id: string): Promise<Run> => {
    return this.collection.findOne({ _id });
  };

  updateArray = async (id: string, array: string, element: string) => {
    return this.collection.updateOne(
      { _id: new ObjectID(id) },
      {
        $push: {
          [array]: element
        }
      }
    );
  };

  updateRun = async (
    id: string,
    updates: Run
  ): Promise<UpdateWriteOpResult> => {
    return this.collection.updateOne(
      { _id: new ObjectID(id) },
      { $set: updates }
    );
  };
}
export default DbHandler;
