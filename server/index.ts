import express from "express";
import next from "next";
import DBHandler from "./DBHandler";
import Watcher from "./Watcher";
const port = parseInt(process.env.PORT || "", 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const dbhandler = new DBHandler();
app
  .prepare()
  .then(dbhandler.initialize)
  .then(() => Watcher(dbhandler.setWatcherStatus))
  .then(() => {
    const server = express();

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
