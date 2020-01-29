import { NextApiRequest, NextApiResponse } from "next";
import DBHandler from "../../server/DBHandler";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const dbHandler = (req as any).db as DBHandler;
  const history = await dbHandler.GetRunHistory();
  res.statusCode = 200;
  res.send(JSON.stringify(history));
  res.end();
};
