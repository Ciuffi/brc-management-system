import { NextApiRequest, NextApiResponse } from "next";
import dbHandler from "../../server/DBHandler";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const dbHandler = (req as any).db as dbHandler;
  const data = JSON.parse(req.body);
  const RunName = data["RunName"];
  console.log(req.method);
  if (!(req.method === "POST") || !RunName) {
    console.log("nope");
    res.statusCode = 500;
    res.end();
    return;
  } else {
    dbHandler.InsertNewRun("", RunName, false, false);
    res.statusCode = 200;
    res.end();
  }
};
