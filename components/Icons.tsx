import { MouseEvent, useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import IconWithInfo from "./IconWithInfo";

type Props = {
  svgString?: string;
  handleIconClick: (e: MouseEvent<HTMLDivElement>) => void;
};
const Icons: React.FC<Props> = ({ svgString, handleIconClick }) => {
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
      <div className="flex">
        {ids.map((id) => (
          <IconWithInfo id={id} key={id} handleIconClick={handleIconClick} />
        ))}
      </div>
    </>
  );
};
export default Icons;
