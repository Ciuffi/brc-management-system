import chokidar from "chokidar";
import { Stats } from "fs";
import dbHandler from "./DBHandler";
import { greenBright } from "chalk";

const RTAComplete = "RTACOMPLETE";
const BCL = ".BCL";
const toWatch = ["towatch", "watchthistoo"];

const greenLog = (str: string) => console.log(greenBright(str));

export default async (dbHandler: dbHandler): Promise<void> => {
  console.log("Starting watcher..");

  const watcher = chokidar.watch(toWatch, {
    persistent: true,
    ignoreInitial: true,
    ignored: ["*/.DS_Store"]
  });

  const handleRTAComplete = async () => {
    const id = (await dbHandler.GetLatestRun())._id;
    await dbHandler.updateRun(id, {
      RunFinished: true,
      RunFinishedTime: new Date().toISOString()
    });
    greenLog(`RTAComplete found`);
  };

  const handleBCL = async (path: string) => {
    const { _id, BCLFolderPath } = await dbHandler.GetLatestRun();
    if (!BCLFolderPath) {
      const BCLFolderPath = path.substring(0, path.lastIndexOf("/") + 1);
      await dbHandler.updateRun(_id, { BCLFolderPath });
    }
    await dbHandler.updateArray(_id, "BCLFilePaths", path);
    greenLog(`BCL file added at ${path}`);
  };

  const onChange = (path: string, stats?: Stats) => {
    console.log(`path: ${path}\nstats: ${stats}`);
    if (path.endsWith(RTAComplete)) {
      handleRTAComplete();
    } else if (path.endsWith(BCL)) {
      handleBCL(path);
    }
  };

  watcher.on("ready", async () => {
    await dbHandler.setWatcherStatus(true);
    greenLog("watcher online!");
    console.log(watcher.getWatched());
    return;
  });
  watcher.on("add", onChange);
  watcher.on("change", onChange);
};
