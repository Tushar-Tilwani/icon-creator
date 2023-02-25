import Icons from "@/components/Icons";
import { uniq, uniqueId } from "lodash";
import { ChangeEvent, useState } from "react";

type Props = {};

const File: React.FC<Props> = () => {
  const [image, setImage] = useState<Blob>();
  const [createObjectURL, setCreateObjectURL] = useState<string>();
  const [imageId, setImageId] = useState<string>("");
  const [forceQuery, setForceQuery] = useState<string>("");

  const uploadToClient = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      setImageId(file.name.split(".")[0]);
      setCreateObjectURL(URL.createObjectURL(file));
    }
  };

  const uploadToServer = async (event: any) => {
    if (!image) {
      alert("Select a file!");
      return;
    }
    const body = new FormData();
    body.append("file", image);
    body.append("id", imageId);
    try {
      await fetch("/api/svg", {
        method: "POST",
        body,
      });
      alert("done!");
      // setImage(undefined);
      // setCreateObjectURL(undefined);
      // setImageId("");
      // event.target.value = null;
      setForceQuery(uniqueId(""));
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div role="document">
      <Icons forceQuery={forceQuery} />
      <article>
        <form onSubmit={(e) => e.preventDefault()}>
          <img src={createObjectURL} />
          <h4>Select Image</h4>
          <input type="file" name="file" onChange={uploadToClient} />
          <input
            type="text"
            name="imageId"
            onChange={(e) => setImageId(e.target.value)}
            value={imageId}
          />
          <button
            className="btn btn-primary"
            type="submit"
            onClick={uploadToServer}
          >
            Upload
          </button>
        </form>
      </article>
    </div>
  );
};

export default File;
