import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { pass } = JSON.parse(req.body);
  if (!pass) {
  }
};
