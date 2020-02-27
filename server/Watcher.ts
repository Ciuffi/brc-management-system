import chokidar from "chokidar";
import { Stats } from "fs";
import dbHandler from "./DBHandler";
import { greenBright } from "chalk";

const RTAComplete = "RTAComplete";
const BCL = ".bcl";

const extensions = [RTAComplete];

const createWatcherArray = (
  basePath: string,
  extensions: string[]
): string[] => {
  return extensions.map(ext => basePath + "**/*" + ext);
};

const toWatch = createWatcherArray("/brcwork/sequence/bcl/", extensions);

const greenLog = (str: string) => console.log(greenBright(str));

export default async (dbHandler: dbHandler): Promise<void> => {
  console.log("Starting watcher..");

  const watcher = chokidar.watch(toWatch, {
    persistent: true,
    ignoreInitial: true,
    ignored: ["*/.DS_Store"],
    depth: 1
  });

  const handleRTAComplete = async (path: string) => {
    const id = (await dbHandler.GetLatestRun())._id;
    const BCLFolderPath = path.substring(0, path.lastIndexOf("/") + 1);
    await dbHandler.updateRun(id, {
      RunFinished: true,
      RunFinishedTime: new Date().toISOString(),
      BCLFolderPath
    });
    greenLog(`RTAComplete found`);
  };

  const onChange = (path: string, stats?: Stats) => {
    console.log(`path: ${path}\nstats: ${stats}`);
    if (path.endsWith(RTAComplete)) {
      handleRTAComplete(path);
    }
  };

  watcher.on("ready", async () => {
    const watched = watcher.getWatched();
    if (Object.keys(watched).length === 0) {
      console.error(
        "Unable to find folder to watch. Please make sure these folders exist: ",
        toWatch
      );
      process.exit();
    }
    await dbHandler.setWatcherStatus(true);
    greenLog("watcher online!");
    console.log(watcher.getWatched());
    return;
  });
  watcher.on("add", onChange);
};
