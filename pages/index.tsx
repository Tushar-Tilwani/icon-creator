import DownloadJSON from "@/components/DownloadJSON";
import DownloadSvg from "@/components/DownloadSvg";
import IconForm from "@/components/IconForm";
import Icons from "@/components/Icons";
import { fetchSvgs } from "@/components/utils/fetchIcons";
import { head } from "lodash";
import { MouseEvent, useReducer, useRef } from "react";

type Props = { svgString: string };

type State = {
  image?: Blob;
  imageObjectURL?: string;
  imageId: string;
  svgString?: string;
  loading?: boolean;
};

type Action = {
  type: string;
  data: {
    file?: Blob;
    id?: string;
    svg?: string;
  };
};

const getInitialState = (initialState: Partial<State> = {}) =>
  ({
    ...initialState,
    imageId: "",
    loading: false,
  } as State);

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "UPLOAD_INITIATED": {
      const file = action.data.file;
      if (!file) {
        return state;
      }
      return {
        ...state,
        image: file,
        imageObjectURL: URL.createObjectURL(file),
        imageId: state.imageId || head(file.name?.split(".")) || "",
      };
    }
    case "CHANGE_ID": {
      const imageId = action.data?.id ?? state.imageId;
      return { ...state, imageId };
    }
    case "UPLOAD_START": {
      const imageId = action.data?.id ?? state.imageId;
      return { ...state, imageId, loading: true };
    }
    case "UPLOAD_FINISH": {
      const svgString = action.data?.svg;
      return { ...getInitialState(), svgString };
    }
    case "ICON_CLICK": {
      const imageId = action.data?.id ?? state.imageId;
      return { ...state, imageId };
    }
    default:
      return getInitialState();
  }
};

const File: React.FC<Props> = ({ svgString: initialSvgString }) => {
  const [state, dispatch] = useReducer(
    reducer,
    getInitialState({ svgString: initialSvgString })
  );

  const formRef = useRef<HTMLElement>(null);

  const { image, imageId, svgString } = state;

  const uploadToClient = (file: Blob) => {
    if (!!file) {
      dispatch({ type: "UPLOAD_INITIATED", data: { file } });
    }
  };

  const uploadToServer = async (id?: string) => {
    if (!image) {
      alert("Select a file!");
      return;
    }

    const body = new FormData();
    body.append("file", image);
    body.append("id", id || imageId);
    try {
      dispatch({ type: "UPLOAD_START", data: { id } });
      const response = await fetch("/api/svg", {
        method: "POST",
        body,
      });
      const { svg } = await response.json();

      dispatch({ type: "UPLOAD_FINISH", data: { svg } });
      alert("done!");
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleIdChange = (id?: string) => {
    dispatch({ type: "CHANGE_ID", data: { id } });
  };

  const handleIconClick = (e: MouseEvent<HTMLDivElement>) => {
    dispatch({
      type: "ICON_CLICK",
      data: { id: e.currentTarget.dataset.iconId },
    });
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "end",
    });
  };

  return (
    <div role="document">
      <article ref={formRef}>
        <header>Change Icon</header>
        <IconForm
          handleIdChange={handleIdChange}
          uploadToClient={uploadToClient}
          uploadToServer={uploadToServer}
          {...state}
        />
      </article>
      <article>
        <header className="header">
          <h2 className="title">Icons</h2>
          <aside>
            <DownloadSvg />
          </aside>
          <aside>
            <DownloadJSON />
          </aside>
        </header>
        <Icons svgString={svgString} handleIconClick={handleIconClick} />
      </article>
    </div>
  );
};

export async function getServerSideProps() {
  const svgString = await fetchSvgs();
  return {
    props: {
      svgString,
    },
  };
}

export default File;
