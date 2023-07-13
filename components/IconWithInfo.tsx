import { MouseEvent } from "react";
import Icon from "./Icon";
import { extractName } from "./utils/svg-utils";

type Props = {
  id: string;
  handleIconClick: (e: MouseEvent<HTMLDivElement>) => void;
};

const IconWithInfo: React.FC<Props> = ({ id, handleIconClick }) => {
  const { iconName, componentName } = extractName(id);
  return (
    <article
      className="icon-container"
      key={id}
      data-icon-id={id}
      onClick={handleIconClick}
    >
      <Icon id={id} />
      <label>
        <code>{iconName}</code>
        <code>{id}</code>
      </label>
    </article>
  );
};
export default IconWithInfo;
