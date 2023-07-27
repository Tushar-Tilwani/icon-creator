import { get } from "lodash";
import { useCallback } from "react";
import { ElementNode, parse } from "svg-parser";
import { fetchSvgs } from "./utils/fetchIcons";
import { toHtml } from "hast-util-to-html";
import { saveAs } from "file-saver";

type Props = { className?: string };

const convertToJson = (svgContent: string) => {
  const parsedSvgContent = parse(svgContent);
  const symbols = (get(parsedSvgContent, "children[0].children") ??
    []) as ElementNode[];
  const svgJson = symbols.reduce((acc: { [key: string]: string }, symbol) => {
    const symbolStr = `${toHtml(symbol as any)}`;
    const id = symbol.properties?.id;
    acc[id || "stuff"] = symbolStr;
    return acc;
  }, {});
  return new Blob([JSON.stringify(svgJson)], { type: "application/json" });
};

const DownloadJSON: React.FC<Props> = () => {
  const downloadJsonFile = useCallback(async () => {
    const svgContent = await fetchSvgs();
    const content = convertToJson(svgContent);
    saveAs(content, "icons.json");
  }, []);

  return (
    <button className="success" onClick={downloadJsonFile}>
      Download JSON
    </button>
  );
};
export default DownloadJSON;
