import { NextApiRequest, NextApiResponse } from "next";
import DbHandler from "../../server/DBHandler";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const dbHandler = (req as any).db as DbHandler;
  const data = JSON.parse(req.body);
  const RunName = data.RunName;
  if (!(req.method === "POST") || !RunName) {
    res.statusCode = 500;
    res.send(500);
    return;
  } else {
    dbHandler.InsertNewRun("", RunName, false, false);
    res.statusCode = 200;
    res.send(200);
  }
};
