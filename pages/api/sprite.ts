// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { promises as fs } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import Spritesmith from "spritesmith";

const __dirname = path.join(process.cwd(), "db/icons");

type COORDTYPE = Record<
  string,
  {
    x: number;
    y: number;
    width: number;
    height: number;
  }
>;

const getName = (key: string) => {
  const parts = key.split("/");
  return parts[parts.length - 1];
};

const convertToCss = (coordinates: COORDTYPE) => {
  return Object.entries(coordinates)
    .map(([key, { x, y, width, height }]) => {
      return `.${getName(key)} 
    {  
      width: ${width}px;
      height: ${height}px;
      background: var(--vim-sprite-url) ${x}px ${y}px;
    }`;
    })
    .join("");
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const sprites = await fs.readdir(__dirname);
  return new Promise((resolve, reject) => {
    // Generate our spritesheet
    Spritesmith.run(
      {
        src: sprites
          .filter((sprite) => sprite.endsWith(".png"))
          .map((sprite) => `${__dirname}/${sprite}`),
      },
      (err: any, result) => {
        const { coordinates, properties } = result;
        //   result.image; // Buffer representation of image
        //   result.coordinates; // Object mapping filename to {x, y, width, height} of image
        //   result.properties; // Object with metadata about spritesheet {width, height}

        fs.writeFile(__dirname + "/sprites.png", result.image);
        res.status(200).send(convertToCss(coordinates));
        resolve({ coordinates, properties });
      }
    );
  });
}
