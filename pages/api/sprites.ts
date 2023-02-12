// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import path from "path";

type URL = {
  url: string;
};

export type URLS = {
  urls: URL[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<URLS>
) {
  const dbDir = path.join(process.cwd(), "db");
  //Read the json data file data.json
  const urls = await fs.readFile(dbDir + "/sprites.json", "utf8");
  const parse = JSON.parse(urls) as URLS;
  parse.urls.push({
    url: "https://ir.ebaystatic.com/cr/v/c01/swc-updated-sprite.webp",
  });

  await fs.writeFile(dbDir + "/sprites.json", JSON.stringify(parse));

  res.status(200).json(parse);
}
