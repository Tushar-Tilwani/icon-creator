import { useEffect, useState } from "react";
import Icon from "./Icon";

type Props = {
  file?: Blob;
  imageId?: string;
};

const IconPreview: React.FC<Props> = ({ file, imageId }) => {
  const [fileContent, setFileContent] = useState<string>("");

  useEffect(() => {
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
      console.log("evt?.target", evt?.target);
      setFileContent(evt?.target?.result as string);
    };
    reader.onerror = function () {
      setFileContent("error reading file");
    };
    return () => {
      reader.abort();
    };
  }, [file]);

  if (file) {
    return (
      <>
        <h6>Image Preview</h6>
        <div
          dangerouslySetInnerHTML={{ __html: fileContent }}
          className="icon_preview"
        ></div>
      </>
    );
  }

  if (imageId) {
    return (
      <>
        <h6>Image Preview</h6>
        <Icon id={imageId} />
      </>
    );
  }

  return null;
};

export default IconPreview;
