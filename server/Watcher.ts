import chokidar from "chokidar";
import { Stats } from "fs";
import DbHandler from "./DBHandler";
import { greenLog, redLog, yellowLog, redError } from "./Logging";
import { existsSync } from "fs";
const Prod = process.env.NODE_ENV === "production";
const folderPath = Prod ? "/brcwork/sequence/bcl/" : "./test/";
const RTAComplete = "RTAComplete";

const folderExists = existsSync(folderPath);
if (!folderExists) {
  redError(
    "> Unable to find folder to watch. Please make sure these folders exist: ",
    folderPath
  );
  process.exit(1);
}

export default async (dbHandler: DbHandler): Promise<void> => {
  await new Promise((resolve, reject) => {
    console.log("> Starting watcher...");

    const watcher = chokidar.watch(`${folderPath}*`, {
      persistent: true,
      ignoreInitial: true,
      ignored: ["*/.DS_Store"],
      depth: 1
    });

    watcher.on("ready", async () => {
      const watched = watcher.getWatched();
      await dbHandler.setWatcherStatus(true);
      greenLog("> watcher online!\n> Watching:");
      console.log(watched);
      resolve();
    });

    // const handleRTAComplete = async (path: string) => {
    //   const lastRun = await dbHandler.GetLatestRun();
    //   if (!lastRun) {
    //     redLog("> No runs inputted but RTAComplete found.");
    //     return;
    //   }
    //   if (lastRun.RunFinished) {
    //     redLog(
    //       `> New RTAComplete received but last run: ${lastRun.RunName} has already been processed.\nThis RTAComplete will be ignored.`
    //     );
    //     return;
    //   }
    //   const { _id: id } = lastRun;
    //   await dbHandler.updateRun(id, {
    //     RunFinished: true,
    //     RunFinishedTime: new Date().toISOString()
    //   });
    //   RTAFound = true;
    //   greenLog(`> RTAComplete found`);
    //   yellowLog("> Waiting for bcl folder..");
    // };

    const handleBCLFolder = async (path: string) => {
      const arr = path.split("/");
      const folderName = arr.pop();
      const runName = `${folderName
        .split("_")
        .slice(0, -1)
        .join("_")}_XXXXXXXXXX`;
      const lastRun = await dbHandler.GetRun(runName);
      if (!lastRun) {
        redLog(`> Run ${runName} not found.\nThis folder will be ignored.`);
        return;
      }
      const { _id: id } = lastRun;
      await dbHandler.updateRun(id, {
        BCLFolderPath: path,
        RunName: folderName,
        RunFinished: true,
        RunFinishedTime: new Date().toISOString()
      });
      greenLog("> BCL Folder created and associated.");
      //RTAFound = false;
    };

    const onChange = (path: string, stats?: Stats) => {
      if (stats?.isDirectory()) {
        handleBCLFolder(path);
      } else {
        yellowLog("> File found by watcher but not processed.");
      }
    };

    watcher.on("add", onChange);
    watcher.on("addDir", onChange);
  });
};
