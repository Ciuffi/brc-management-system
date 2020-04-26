import { NextApiRequest, NextApiResponse } from "next";
import DbHandler from "../../server/DBHandler";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const dbHandler = (req as any).db as DbHandler;
  const data = JSON.parse(req.body);
  const RunID = data.RunID;
  if (!(req.method === "POST") || !RunID) {
    res.statusCode = 500;
    res.send(500);
    return;
  } else {
    const result = await dbHandler.DeleteRun(RunID);
    console.log(result);
    res.statusCode = 200;
    res.send(200);
  }
};
