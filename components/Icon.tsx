type Props = { id: string; className?: string; size?: number };

const Icon: React.FC<Props> = ({ id, className = "", size = 32 }) => (
  <span className={`icon ${className}`}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size} ${size}`}>
      <use href={`#${id}`} />
    </svg>
  </span>
);
export default Icon;
