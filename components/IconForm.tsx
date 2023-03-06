import { ChangeEvent } from "react";
import Icon from "./Icon";

type Props = {
  uploadToClient: (event: ChangeEvent<HTMLInputElement>) => void;
  uploadToServer: () => void;
  handleIdChange: (e: ChangeEvent<HTMLInputElement>) => void;
  image?: Blob;
  imageObjectURL?: string;
  imageId: string;
  loading?: boolean;
};

const IconForm: React.FC<Props> = ({
  uploadToClient,
  uploadToServer,
  handleIdChange,
  image,
  imageObjectURL,
  imageId,
  loading,
}) => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="file">Select Image</label>
      <input type="file" name="file" onChange={uploadToClient} />
      <label htmlFor="imageId">Image Id</label>
      <input
        type="text"
        name="imageId"
        onChange={handleIdChange}
        value={imageId}
      />
      <button
        className="btn btn-primary"
        type="submit"
        disabled={!image || !!loading}
        onClick={uploadToServer}
        aria-busy={loading}
      >
        Upload
      </button>
      {imageObjectURL && (
        <>
          <h6>Image Preview</h6>
          <img src={imageObjectURL} />
        </>
      )}
      {imageId && !imageObjectURL && (
        <>
          <h6>Image Preview</h6>
          <Icon id={imageId} />
        </>
      )}
    </form>
  );
};

export default IconForm;
