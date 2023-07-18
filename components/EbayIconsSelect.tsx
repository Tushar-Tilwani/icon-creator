import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import ebaySvg from "../node_modules/@ebay/skin/dist/svg/icons.svg";

type Props = {
  className?: string;
  onChange?: (id: string | undefined, e: any) => void;
};

const EbayIcons: React.FC<Props> = ({ onChange, className = "" }) => {
  const ebaySvgRef = useRef<HTMLDivElement>(null);
  const [ids, setIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  useEffect(() => {
    if (!!ebaySvgRef.current) {
      const symbolIds = Array.from(
        ebaySvgRef.current.getElementsByTagName("symbol") ?? []
      ).map((symbol) => symbol.id);
      setIds(symbolIds);
    }
  }, [ebaySvgRef.current, setIds]);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      setSelectedId(e.currentTarget.dataset.id as string);
      if (ebaySvgRef.current) {
        console.log(
          ebaySvgRef.current.querySelector(
            `symbol#${e.currentTarget.dataset.id}`
          )
        );
      }
      onChange && onChange(e.currentTarget.dataset.id, e);
    },
    [onChange, ebaySvgRef]
  );

  const handleOpen = (e: MouseEvent<HTMLDetailsElement>) => {
    setIsOpen(!isOpen);
    e.preventDefault();
  };

  return (
    <>
      <div
        hidden
        dangerouslySetInnerHTML={{ __html: ebaySvg }}
        ref={ebaySvgRef}
      />

      <details role="list" open={isOpen} onClick={handleOpen}>
        <summary aria-haspopup="listbox">{selectedId || "Ebay Icons"}</summary>
        <ul role="listbox" className="icon-dropdown">
          {ids.map((id) => (
            <li key={id}>
              <a data-id={id} onClick={handleClick}>
                <span className="listrow">
                  <span>{id}</span>
                  <span className={`icon ${className}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox={`0 0 32 32`}
                    >
                      <use href={`#${id}`} />
                    </svg>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </details>
    </>
  );
};
export default EbayIcons;
