import chokidar from "chokidar";
import { Stats } from "fs";
import DbHandler from "./DBHandler";
import { greenLog, redLog, yellowLog } from "./Logging";
const RTAComplete = "RTAComplete";
const BCL = ".bcl";

const extensionList = [RTAComplete];

const createWatcherArray = (
  basePath: string,
  extensions: string[]
): string[] => {
  return extensions.map(ext => basePath + "**/*" + ext);
};

const toWatch = createWatcherArray("/brcwork/sequence/bcl/", extensionList);

export default async (dbHandler: DbHandler): Promise<void> => {
  await new Promise((resolve, reject) => {
    let RTAFound = false;
    console.log("> Starting watcher...");

    const watcher = chokidar.watch("/brcwork/sequence/bcl/**/*", {
      persistent: true,
      ignoreInitial: true,
      ignored: ["*/.DS_Store"],
      depth: 1
    });

    watcher.on("ready", async () => {
      const watched = watcher.getWatched();
      if (Object.keys(watched).length === 0) {
        console.error(
          "> Unable to find folder to watch. Please make sure these folders exist: ",
          toWatch
        );
        process.exit(1);
      }
      await dbHandler.setWatcherStatus(true);
      greenLog("> watcher online!\n> Watching:");
      console.log(watched);
      resolve();
    });

    const handleRTAComplete = async (path: string) => {
      const id = (await dbHandler.GetLatestRun())._id;
      await dbHandler.updateRun(id, {
        RunFinished: true,
        RunFinishedTime: new Date().toISOString()
      });
      RTAFound = true;
      greenLog(`> RTAComplete found`);
      yellowLog("> Waiting for bcl folder..");
    };

    const handleBCLFolder = async (path: string) => {
      const id = (await dbHandler.GetLatestRun())._id;
      await dbHandler.updateRun(id, {
        BCLFolderPath: path
      });
      greenLog("> BCL Folder created and associated.");
      RTAFound = false;
    };

    const onChange = (path: string, stats?: Stats) => {
      if (path.endsWith(RTAComplete)) {
        handleRTAComplete(path);
      } else if (RTAFound && stats?.isDirectory()) {
        handleBCLFolder(path);
      } else {
        yellowLog("> File found bye listener but not processed.");
      }
    };

    watcher.on("add", onChange);
    watcher.on("addDir", onChange);
  });
};
