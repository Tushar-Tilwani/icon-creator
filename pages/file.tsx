import { ChangeEvent, useState } from "react";

type PROPS = {};
const File: React.FC<PROPS> = (props) => {
  const [image, setImage] = useState<Blob>();
  const [createObjectURL, setCreateObjectURL] = useState<string>();

  const uploadToClient = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const uploadToServer = async (event: any) => {
    if (!image) {
      alert("Select a file!");
      return;
    }
    const body = new FormData();
    body.append("file", image);
    try {
      await fetch("/api/file", {
        method: "POST",
        body,
      });
      alert("done!");
      setImage(undefined);
      setCreateObjectURL(undefined);
    } catch (err: any) {
      console.log(err);
      alert(`${err.message}`);
    }
  };

  return (
    <div>
      <div>
        <img src={createObjectURL} />
        <h4>Select Image</h4>
        <input type="file" name="myImage" onChange={uploadToClient} />
        <button
          className="btn btn-primary"
          type="submit"
          onClick={uploadToServer}
        >
          Send to server
        </button>
      </div>
    </div>
  );
};

export default File;
