import { head } from "lodash";
import { useCallback, useEffect, useState } from "react";
import EbayIconsSelect from "./EbayIconsSelect";
import IconPreview from "./IconPreview";
import { idToUseBlob } from "./utils/svg-utils";

type Props = {
  uploadToClient: (file: Blob) => void;
  uploadToServer: (id?: string) => void;
  handleIdChange: (id?: string) => void;
  image?: Blob;
  imageObjectURL?: string;
  imageId: string;
  loading?: boolean;
};

const IconForm: React.FC<Props> = ({
  uploadToClient,
  uploadToServer,
  image,
  imageId: baseImageId,
  loading,
}) => {
  const [imageId, setImageId] = useState<string | undefined>(baseImageId);

  useEffect(() => {
    setImageId(baseImageId);
  }, [baseImageId]);

  const uploadEbayIdToClient = useCallback(
    (id?: string) => {
      if (!id) {
        return;
      }
      uploadToClient(idToUseBlob(id));
    },
    [uploadToClient, setImageId]
  );

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <EbayIconsSelect onChange={uploadEbayIdToClient} />
      <label htmlFor="file">Select Image</label>
      <input
        type="file"
        name="file"
        onChange={(event) => {
          uploadToClient(head(event?.target?.files) as Blob);
        }}
      />
      <label htmlFor="imageId">Image Id</label>
      <input
        type="text"
        name="imageId"
        onChange={(e) => setImageId(e.target.value)}
        value={imageId}
      />
      <button
        className="btn btn-primary"
        type="submit"
        disabled={!image || !!loading}
        onClick={() => {
          uploadToServer(imageId);
        }}
        aria-busy={loading}
      >
        Upload
      </button>
      <IconPreview file={image} imageId={baseImageId} />
    </form>
  );
};

export default IconForm;
