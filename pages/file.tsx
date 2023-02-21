import { ChangeEvent, useState } from "react";

type PROPS = {};
const File: React.FC<PROPS> = (props) => {
  const [image, setImage] = useState<Blob>();
  const [createObjectURL, setCreateObjectURL] = useState<string>();
  const [json, setJson] = useState<string>("");
  const [imageId, setImageId] = useState<string>("");

  const uploadToClient = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      setImage(file);
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
      await fetch("/api/files3", {
        method: "POST",
        body,
      });
      alert("done!");
      // setImage(undefined);
      // setCreateObjectURL(undefined);
      // setImageId("");
      event.target.value = null;
    } catch (err: any) {
      console.log(err);
    }
  };

  const genSpirite = async (event: any) => {
    const res = await fetch("/api/sprite");
    const json = await res.json();
    setJson(JSON.stringify(json));
  };

  return (
    <div role="document">
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
          ></input>
          <button
            className="btn btn-primary"
            type="submit"
            onClick={uploadToServer}
          >
            Upload
          </button>
        </form>
      </article>
      <article>
        <button className="btn btn-primary" type="submit" onClick={genSpirite}>
          Get a spirite image
        </button>
      </article>
      <aside>
        <code>{json}</code>
      </aside>
    </div>
  );
};

export default File;
