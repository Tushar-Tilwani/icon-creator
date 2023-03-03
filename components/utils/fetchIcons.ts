const defaultUrl =
  "https://imagebucket30781.s3.us-west-2.amazonaws.com/icon/icons.svg";

export const fetchSvgs = async (url: string = defaultUrl) =>
  fetch(url, { mode: "cors" }).then((response) => response.text());
