import { ChangeEvent } from "react";

type Props = {
  uploadToClient: (event: ChangeEvent<HTMLInputElement>) => void;
  uploadToServer: () => void;
  handleIdChange: (e: ChangeEvent<HTMLInputElement>) => void;
  image?: Blob;
  imageObjectURL?: string;
  imageId: string;
};

const IconForm: React.FC<Props> = ({
  uploadToClient,
  uploadToServer,
  handleIdChange,
  image,
  imageObjectURL,
  imageId,
}) => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <img src={imageObjectURL} />
      <h4>Select Image</h4>
      <input type="file" name="file" onChange={uploadToClient} />
      <input
        type="text"
        name="imageId"
        onChange={handleIdChange}
        value={imageId}
      />
      <button
        className="btn btn-primary"
        type="submit"
        disabled={!image}
        onClick={uploadToServer}
      >
        Upload
      </button>
    </form>
  );
};

export default IconForm;
