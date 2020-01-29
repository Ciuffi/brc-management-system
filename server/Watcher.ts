import chokidar from "chokidar";
import { Stats } from "fs";
import dbHandler from "./DBHandler";

const onChange = (path: string, stats?: Stats) => {
  console.log(`path: ${path}\nstats: ${stats}`);
};

export default async (
  updateStatus: dbHandler["setWatcherStatus"]
): Promise<void> => {
  console.log("watcher online!");
  const watcher = chokidar.watch(["towatch", "watchthistoo"], {
    persistent: true,
    ignoreInitial: true,
    ignored: ["*/.DS_Store"]
  });
  watcher.on("ready", async () => {
    await updateStatus(true);
    return;
  });
  watcher.on("add", path => {
    console.log(path);
  });
  watcher.on("unlink", path => {
    console.log(path);
  });
  watcher.on("change", path => {
    console.log(path);
  });
};
