import { saveAs } from "file-saver";
import { toHtml } from "hast-util-to-html";
import { Node } from "hast-util-to-html/lib/types";
import JSZip from "jszip";
import { cloneDeep, get } from "lodash";
import { ElementNode, parse } from "svg-parser";
import { fetchSvgs } from "./utils/fetchIcons";

type Props = {};
const symbolToContent = (baseSymbol: ElementNode) => {
  const symbol = cloneDeep(baseSymbol);
  symbol.properties = Object.assign(
    {
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      "xmlns:xlink": "http://www.w3.org/1999/xlink",
    },
    symbol.properties ?? {}
  );
  symbol.tagName = "svg";
  const name = symbol.properties.id as string;
  const content = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>${toHtml(
    symbol as Node
  )}`;
  return [name, content];
};

const getZippedSvgs = async (svgContent: string) => {
  const parsedSvgContent = parse(svgContent);
  const symbols = (get(parsedSvgContent, "children[0].children") ??
    []) as ElementNode[];
  const contents = symbols.map(symbolToContent);
  const zip = new JSZip();
  for (const [name, content] of contents) {
    zip.file(`${name}.svg`, content);
  }
  const content = await zip.generateAsync({ type: "blob" });
  return content;
};

const DownloadSvg: React.FC<Props> = () => {
  const downloadSvg = async () => {
    try {
      const svgContent = await fetchSvgs();
      const content = await getZippedSvgs(svgContent);
      saveAs(content, "icons.zip");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <button className="success" onClick={downloadSvg}>
      Download
    </button>
  );
};

export default DownloadSvg;
