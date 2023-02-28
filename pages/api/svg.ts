import AWS from "aws-sdk";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import formidable from "formidable";
import { promises as fs } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import s3UploadStream from "s3-upload-stream";
import { Readable } from "stream";
import svg2Sprite from "svg2sprite";

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
      // console.log(fields.id, files);
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
    const incomingSvg = buffer.toString("utf-8");

    const s3 = new AWS.S3({});
    const s3Options = {
      Bucket: "imagebucket30781",
      Key: "icon/icons.svg",
    };

    const s3Stream = s3UploadStream(s3);
    const upload = s3Stream.upload({ ...s3Options, ContentType: "text/xml" });

    let data;
    try {
      data = await s3.getObject(s3Options).promise();
    } catch (err) {
      console.error(err);
      reject(err);
    }

    const currentSvg = data?.Body?.toString("utf-8");
    const svg = getSvgString(incomingSvg, id, currentSvg);
    const svgStream = Readable.from(svg);
    svgStream.pipe(upload);

    upload.on("error", function (error) {
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
      resolve({ ...details, svg });
    });
  });
};

const getSvgString = (
  incomingSvgContent: string,
  incomingSvgId: string,
  currentSvgContent?: string
) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
  });
  const builder = new XMLBuilder({
    ignoreAttributes: false,
  });
  const sprite = svg2Sprite.collection({ inline: true });
  if (currentSvgContent) {
    const obj = parser.parse(currentSvgContent);
    const symbol = obj.svg.symbol;
    const symbols = Array.isArray(symbol) ? symbol : [symbol];
    symbols.forEach((sym: any) => {
      const id = `${sym["@_id"]}`;
      const viewBox = !!sym["@_viewBox"]
        ? ` viewBox="${sym["@_viewBox"]}" `
        : "";

      const content = `<svg${viewBox}>${builder
        .build(sym)
        .toString("utf-8")}</svg>`;

      sprite.add(id, content);
    });
  }
  const uploadedSvg = parser.parse(incomingSvgContent).svg;
  const viewBox = !!uploadedSvg["@_viewBox"]
    ? ` viewBox="${uploadedSvg["@_viewBox"]}"`
    : "";
  const uploadedSvgInnerContent = builder.build(uploadedSvg).toString("utf-8");
  sprite.add(incomingSvgId, `<svg${viewBox}>${uploadedSvgInnerContent}</svg>`);
  return sprite.compile();
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
