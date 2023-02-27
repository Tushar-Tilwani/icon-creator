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
        disabled={!image}
        onClick={uploadToServer}
      >
        Upload
      </button>
      {imageObjectURL && (
        <>
          <h6>Image Preview</h6>
          <img src={imageObjectURL} />
        </>
      )}
    </form>
  );
};

export default IconForm;
