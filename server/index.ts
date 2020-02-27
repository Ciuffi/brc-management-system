import express from "express";
import next from "next";
import directory from "serve-index";
import DBHandler from "./DBHandler";
import Watcher, { greenLog } from "./Watcher";
import configureAuth from "./Auth";
import bodyParser from "body-parser";
import expressSession from "express-session";
import { parse } from "url";

const port = parseInt(process.env.PORT || "", 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const dbhandler = new DBHandler();
const bclFilesPath = "/brcwork/sequence/bcl/";

const basePath = dev ? "" : "/bms";

// Initialize the database handler, then
// Initialize the folder watcher, then
// Prepare frontend nextjs bundle, then
// Configuration authentication, then
// Setup server.
dbhandler
  .initialize()
  .then(() => Watcher(dbhandler))
  .then(async () => {
    console.log("> preparing frontend bundle..");
    await app.prepare();
    greenLog("> Bundle built!");
  })
  .then(configureAuth)
  .then(auth => {
    const server = express();
    const { passport, loggedIn, loggedOut } = auth;

    // Server static files
    server.use("/bms/bcl", loggedIn, directory(bclFilesPath));
    server.use("/bcl", loggedIn, express.static(bclFilesPath));

    // Setup Auth and its dependancies.
    server.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    server.use(
      expressSession({
        secret: "anything",
        resave: false,
        saveUninitialized: true
      })
    );
    server.use(passport.initialize());
    server.use(passport.session());

    // Share data with frontend
    server.use((req, res, next) => {
      (req as any).db = dbhandler;
      (req as any).dev = dev;
      next();
    });

    // Logout route
    server.get("/logout", loggedIn, (req, res) => {
      req.logout();
      req.session.destroy(err => (err ? console.log(err) : null));
      res.redirect(`${basePath}/login`);
    });

    // Login routes
    server.post(
      "/login",
      passport.authenticate("local", {
        failureRedirect: `${basePath}/login`,
        successRedirect: `${basePath}/`,
        session: true
      })
    );
    server.get("/login", loggedOut, (req, res) => {
      return app.render(req, res, "/login");
    });

    // Blocked off index routes
    server.get("/", loggedIn, (req, res) => {
      return app.render(req, res, "/");
    });

    server.all(["/api", "/api*"], loggedIn, (req, res) => {
      const path = parse(req.url);
      console.log(path);
      return app.render(req, res, path.pathname);
    });

    // NextJs handler
    server.all("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Listening on http://localhost:${port}`);
    });
  });
