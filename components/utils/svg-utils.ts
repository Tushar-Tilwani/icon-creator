import { XMLBuilder, XMLParser } from "fast-xml-parser";
import svg2Sprite from "svg2sprite";

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

const extractName = (id: string) => {
  const [, ...names] = id.split("-");
  const name = names[names.length - 1] || "";
  const iconName = name.toLocaleUpperCase();
  //Remove last char
  const componentName = names.slice(0, -1).join(" ")?.toLocaleUpperCase();
  return { iconName, componentName };
};

const idToUseBlob = (id: string) => {
  const useString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><use href="#${id}"></use></svg>`;
  return new Blob([useString], { type: "image/svg+xml" });
};

export { getSvgString, extractName, idToUseBlob };
