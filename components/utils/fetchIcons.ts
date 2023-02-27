const defaultUrl =
  "https://imagebucket30781.s3.us-west-2.amazonaws.com/icon/icons.svg";

export const fetchSvgs = async (url: string = defaultUrl) =>
  fetch(url, { mode: "cors" })
    .then((response) => response.body)
    .then((body) => {
      if (!body) {
        return "";
      }
      const reader = body.getReader();

      return new ReadableStream({
        start(controller) {
          return pump();

          function pump(): any {
            return reader.read().then(({ done, value }) => {
              // When no more data needs to be consumed, close the stream
              if (done) {
                controller.close();
                return;
              }

              // Enqueue the next data chunk into our target stream
              controller.enqueue(value);
              return pump();
            });
          }
        },
      });
    })
    .then((stream) => new Response(stream))
    .then((response) => response.text());
