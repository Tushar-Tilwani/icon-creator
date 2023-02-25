import AWS from "aws-sdk";
import formidable from "formidable";
import { promises as fs } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import s3UploadStream from "s3-upload-stream";
import { Readable } from "stream";
import svg2Sprite from "svg2sprite";
import { ElementNode, parse } from "svg-parser";
import { get } from "lodash";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

export const config = {
  api: {
    bodyParser: false,
  },
};

AWS.config.loadFromPath("./aws_config.json");

const post = async (req: any) => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      console.log(fields.id, files);
      if (err) {
        reject(err);
        return;
      }

      try {
        const response = await saveFile(
          files.file as formidable.File,
          (fields.id as string) || "Id1"
        );
        resolve(response);
      } catch (e) {
        reject(e);
      }
    });
  });
};

const saveFile = async (file: formidable.File, id: string) => {
  return new Promise(async (resolve, reject) => {
    const buffer = await fs.readFile(file.filepath);

    const s3 = new AWS.S3({});
    const s3Options = {
      Bucket: "imagebucket30781",
      Key: "icon/icons.svg",
    };

    const s3Stream = s3UploadStream(s3);
    const upload = s3Stream.upload({ ...s3Options, ContentType: "text/xml" });
    const parser = new XMLParser({
      ignoreAttributes: false,
    });
    const builder = new XMLBuilder({
      ignoreAttributes: false,
    });

    s3.getObject(
      s3Options,
      (err, data) => {
        const svgContent = data?.Body?.toString("utf-8");
        const sprite = svg2Sprite.collection({ inline: true });
        if (svgContent) {
          const obj = parser.parse(svgContent);
          // console.log(builder.build(obj.svg.symbol));
          const symbol = obj.svg.symbol;
          const symbols = Array.isArray(symbol) ? symbol : [symbol];
          symbols.forEach((sym: any) => {
            const id = `${sym["@_id"]}`;
            const content = `<svg>${builder
              .build(sym)
              .toString("utf-8")}</svg>`;
            console.log("r", id, content);
            sprite.add(id, content);
          });
        }
        sprite.add(id, buffer.toString("utf-8"));
        const svg = sprite.compile();
        const svgStream = Readable.from(svg);
        svgStream.pipe(upload);
        console.log(svg);
        // resolve(svgContent);
      }

      // const svg = sprite.compile();
      // const parsedSvg = parse(svgContent);
      // const svgSymbols = get(
      //   parsedSvg,
      //   "children[0].children"
      // ) as unknown as ElementNode[];
      // console.log(svgSymbols.map((value) => [value.properties?.id]));
      // console.log(svg);
      // resolve(svgContent);
    );

    upload.on("error", function (error) {
      // console.log(error);
      reject(error);
    });

    /* Handle progress. Example details object:
       { ETag: '"f9ef956c83756a80ad62f54ae5e7d34b"',
         PartNumber: 5,
         receivedSize: 29671068,
         uploadedSize: 29671068 }
    */
    upload.on("part", function (details) {
      console.log(details);
    });

    /* Handle upload completion. Example details object:
       { Location: 'https://bucketName.s3.amazonaws.com/filename.ext',
         Bucket: 'bucketName',
         Key: 'filename.ext',
         ETag: '"bf2acbedf84207d696c8da7dbb205b9f-5"' }
    */
    upload.on("uploaded", function (details) {
      console.log(details);
      resolve(details);
    });
  });
};

export default (req: NextApiRequest, res: NextApiResponse<any>) => {
  return new Promise(async (resolve, reject) => {
    if (req.method === "POST") {
      try {
        const details = await post(req);
        res.status(200).send(details);
        resolve("Done");
      } catch (e) {
        res.status(500).send(e);
        reject(e);
      }

      return;
    }
    req.method === "POST"
      ? post(req)
      : req.method === "PUT"
      ? console.log("PUT")
      : req.method === "DELETE"
      ? console.log("DELETE")
      : req.method === "GET"
      ? console.log("GET")
      : res.status(404).send("");
    resolve("Done");
  });
};
