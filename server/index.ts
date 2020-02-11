import express from "express";
import next from "next";
import directory from "serve-index";
import DBHandler from "./DBHandler";
import Watcher from "./Watcher";
const port = parseInt(process.env.PORT || "", 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const dbhandler = new DBHandler();
const bclFilesPath = "/brcwork/sequence/bcl/";
console.log(bclFilesPath);
app
  .prepare()
  .then(dbhandler.initialize)
  .then(() => Watcher(dbhandler))
  .then(() => {
    const server = express();

    server.use(
      "/bms/bcl",
      express.static(bclFilesPath),
      directory(bclFilesPath)
    );

    server.use((req, res, next) => {
      (req as any).db = dbhandler;
      next();
    });
    server.all("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  });
