import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { fetchSvgs } from "./utils/fetchIcons";

type Props = { svgString?: string };
const Icons: React.FC<Props> = ({ svgString }) => {
  const [svgs, setSvgs] = useState<string>("");
  const [ids, setIds] = useState<string[]>([]);
  const svgDivRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    svgString && setSvgs(svgString);
  }, [svgString]);

  useEffect(() => {
    if (!!svgDivRef.current) {
      const symbolIds = Array.from(
        svgDivRef.current.getElementsByTagName("symbol") ?? []
      ).map((symbol) => symbol.id);
      setIds(symbolIds);
    }
  }, [svgDivRef.current, setIds, svgs]);

  return (
    <>
      <div hidden dangerouslySetInnerHTML={{ __html: svgs }} ref={svgDivRef} />
      <div className="grid">
        {ids.map((id) => (
          <div className="col-sm-6 col-md-4 col-lg-3 col-xl-2" key={id}>
            <Icon id={id} />
            <label>{id}</label>
          </div>
        ))}
      </div>
    </>
  );
};
export default Icons;
