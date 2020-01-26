import { MongoClient, Db, Collection, UpdateWriteOpResult } from "mongodb";
import Run from "./models/Run";
// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const DB_NAME = "brc";
const COLLECTION_NAME = "runs";

// Create a new MongoClient
const client = new MongoClient(url);

const dbHandler = () => {
    let db: Db;
    let collection: Collection;

    const initialize = async () => {
        await client.connect();
        db = client.db(DB_NAME);
        collection = db.collection(COLLECTION_NAME);
    };

    const GetRunHistory = async (): Promise<Run[]> => {
        return await collection
            .find({})
            .sort({ _id: 1 })
            .toArray();
    };

    const InsertNewRun = async (
        labName: string,
        runName: string,
        runFinished: boolean,
        error: boolean
    ): Promise<void> => {
        collection.insertOne({
            LabName: labName,
            RunName: runName,
            RunFinished: runFinished,
            Error: error,
            CreatedTime: new Date().toISOString()
        });
    };

    const GetLatestRun = async (): Promise<Run> => {
        return collection
            .find({})
            .sort({ _id: 1 })
            .limit(1)
            .next();
    };

    const updateRun = async (
        id: number,
        updates: any
    ): Promise<UpdateWriteOpResult> => {
        return collection.updateOne({ _id: id }, updates);
    };
    return {
        initialize,
        GetRunHistory,
        InsertNewRun,
        updateRun,
        GetLatestRun
    };
};
const handler = dbHandler();
export default handler;
