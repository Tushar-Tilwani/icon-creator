import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { fetchSvgs } from "./utils/fetchIcons";

type Props = { forceQuery?: string };
const url =
  "https://imagebucket30781.s3.us-west-2.amazonaws.com/icon/icons.svg";
const Icons: React.FC<Props> = ({ forceQuery }) => {
  const [svgs, setSvgs] = useState<string>("");
  const [ids, setIds] = useState<string[]>([]);
  const svgDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSvgs(url).then(setSvgs);
  }, [setSvgs, forceQuery]);

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
      <article className="grid">
        {ids.map((id) => (
          <div className="col-sm-6 col-md-4 col-lg-3 col-xl-2">
            <Icon key={id} id={id} />
            <label>{id}</label>
          </div>
        ))}
      </article>
    </>
  );
};
export default Icons;
