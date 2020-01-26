import chokidar from "chokidar";
import { Stats } from "fs";

const onChange = (path: string, stats?: Stats) => {
    console.log(`path: ${path}\nstats: ${stats}`);
};

export default () => {
    const watcher = chokidar.watch("toWatch/*", {
        persistent: true,
        ignoreInitial: true,
        ignored: ["*/.DS_Store"]
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
