import { ChangeEvent, useEffect, useState } from "react";

type PROPS = {};
const url =
  "https://imagebucket30781.s3.us-west-2.amazonaws.com/icon/icons.svg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHkaCXVzLXdlc3QtMiJGMEQCIB%2BU%2B%2BHYJN3%2F3Ax7089xjQCi3SRAT0kiMxePL%2BZRKJ1pAiBqGHZBsCE7BvxCCPG%2BCaZxyvGPw%2ByXAd3wujTPnuy19irkAggiEAAaDDYyODQ2NTM3NTc4NiIMovbjYhOT6V4jRnk6KsECIUqdxP0Q33AmQfqjCJLYdh3UyoFcup7Z0mm5aVU5s3M5zEbxMPjM%2FvunKeVFAVOrLEBZYXZo30hUEdya43E6Ng56kjNMm%2BRQYgzRJG8s4qhG%2FBqaSRBNH%2BmKpmAEstCBczN0SU9%2FG8MxmzWkLbExfVlJYEmv5XV%2BXiTiaVVHJqxtsmfVm9McNUa8n7B1zxhfMDdKXjbMm9%2FQg%2BD2PAO1STCUKU9jYU%2FfiYugfkzfDOF372eheNXn9i8NN0%2FY7YnJdS6BZ4wizbdatbumMoGxU%2FiUb2JUP1TRqDhZrqL%2FpW3hXiMBBhw655DMDiOPAc%2Bba0XjYpTg2Nlb5G8PfOl%2BltYGgJAvkFVi2FgWyIdq0Tvx1p61r5yjuQWLlcsLr3%2Bw7UEA898gqfQbFXGek2u6kWbI3mQfNc9TqugZU%2B%2B2Jo0nMN2v5Z8GOrQC71v9ETILxWgy%2B9QMB9A%2FU%2FRDhMQmeAKEowJCo5NSlXjjyugS5K6eNbJCQhOrWEatC7a7v2VPc1mapXmnyUIsstjY1unOmxYuYObqL6%2BUAao22IA2jH2boXLUGf5S6fAXy7CMRYKFeahWRK%2Fvh1zZ8diaWWzzcsTY56lFb8ph49Dvygi%2F5qt%2F058ToH1Xab%2BjGXq%2Fn7uyp4zNoaxkNTjYK7KpH1gIbkerRBu%2BUFwNhOguMv3lrTNnE3UuwGZeW%2BkcKCnMxZBM0e%2FshD%2Foz3CTlFLyyBxlD8b9tcG8xmp3mcqBwNLM5gtp6TOsgnupJiaqbTc62fPukyAmHOuTLl4m1dINnbysy6DvWQJ02uHQwdIYorDvVHE%2FRMUc3TZq%2BqAFXuGzUHoKUb%2F0ZpWmnAxd1BBw0QY%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230225T003613Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIAZEU3UTIVM6MIIRYE%2F20230225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=3abb0c83372651fe1f4b80bb7a57c101ca26b980c39eee3ac131225acc2bd39a";
const File: React.FC<PROPS> = (props) => {
  const [image, setImage] = useState<Blob>();
  const [createObjectURL, setCreateObjectURL] = useState<string>();
  const [json, setJson] = useState<string>("");
  const [imageId, setImageId] = useState<string>("");
  const [svgs, setSvgs] = useState<string>("");

  useEffect(() => {
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
      .then((response) => response.text())
      .then((res) => setSvgs(res));
  }, [setSvgs]);

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
      await fetch("/api/files1", {
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
      <div hidden dangerouslySetInnerHTML={{ __html: svgs }}></div>
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
        <span className="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 40 40"
          >
            <use href="#abc1" />
          </svg>
        </span>
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
