import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import path from "path";
export const config = {
  api: {
    bodyParser: false,
  },
};

const __dirname = path.join(process.cwd(), "db/icons");

const post = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    console.log(fields.id, files);
    try {
      await saveFile(files.file);
      return res.status(201).send("");
    } catch (e: any) {
      return res.status(500).send(e.message);
    }
  });
};

const saveFile = async (file: any) => {
  const data = await fs.readFile(file.filepath);
  await fs.writeFile(`${__dirname}/${file.originalFilename}`, data);
  await fs.unlink(file.filepath);
  return;
};

export default (req: NextApiRequest, res: NextApiResponse<any>) => {
  req.method === "POST"
    ? post(req, res)
    : req.method === "PUT"
    ? console.log("PUT")
    : req.method === "DELETE"
    ? console.log("DELETE")
    : req.method === "GET"
    ? console.log("GET")
    : res.status(404).send("");
};
