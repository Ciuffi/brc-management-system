import chokidar from "chokidar";
import { Stats } from "fs";
import DbHandler from "./DBHandler";
import { greenLog, redLog, yellowLog, redError } from "./Logging";
import { existsSync } from "fs";
import BCL2FASTQ from "./BCL2FASTQ";
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

    let activeRuns = [];
    let waitingRuns = [];
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

    const handleRTAComplete = async (path: string) => {
      if (!activeRuns.length) {
        redLog(`
        > new RTAComplete received but no active rounds found.`);
      }
      const currentRun = activeRuns.shift();
      const lastRun = await dbHandler.GetRunByID(currentRun);
      if (lastRun.RunFinished) {
        redLog(
          `> New RTAComplete received but last run: ${lastRun.RunName} has already been processed.\nThis RTAComplete will be ignored.`
        );
        return;
      }
      const { _id: id } = lastRun;
      await dbHandler.updateRun(id, {
        RunFinished: true,
        RunFinishedTime: new Date().toISOString()
      });
      greenLog(`> RTAComplete found`);
      if (activeRuns.length === 0) {
        yellowLog(`> Starting BCL2FASTQ...`);
        BCL2FASTQ(id, dbHandler);
        waitingRuns.forEach(waitingID => BCL2FASTQ(waitingID, dbHandler));
      } else {
        waitingRuns.push(id);
        yellowLog(
          `> Waiting on all runs to finish before starting BCL2FASTQ...`
        );
      }
    };

    const handleBCLFolder = async (path: string) => {
      const arr = path.split("/");
      const folderName = arr.pop();
      const runName = `${folderName
        .split("_")
        .slice(0, -1)
        .join("_")}_XXXXXXXXXX`;
      const RelevantRun = await dbHandler.GetRun(runName);
      if (!RelevantRun) {
        redLog(`> Run ${runName} not found.\nThis folder will be ignored.`);
        return;
      }
      const { _id: id } = RelevantRun;
      await dbHandler.updateRun(id, {
        BCLFolderPath: path,
        RunName: folderName
      });
      activeRuns.push(id);
      greenLog("> BCL Folder created and associated.");
      yellowLog("> Waiting for RTAComplete..");
    };

    const onChange = (path: string, stats?: Stats) => {
      if (stats?.isDirectory()) {
        handleBCLFolder(path);
      } else if (path.endsWith(RTAComplete)) {
        handleRTAComplete(path);
      } else {
        yellowLog("> File found by watcher but not processed.");
      }
    };

    watcher.on("add", onChange);
    watcher.on("addDir", onChange);
  });
};
