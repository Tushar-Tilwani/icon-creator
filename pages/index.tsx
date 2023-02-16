import Head from "next/head";
import { ChangeEvent, useState } from "react";
import useSWR from "swr";
import { URLS } from "./api/data";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [spriteImage, setSpriteImage] = useState<string>();
  const { data, error, isLoading } = useSWR<URLS>("/api/sprites", fetcher);
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setSpriteImage(e.target.value);

  return (
    <>
      <Head>
        <title>Icon Creator</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container-fluid">
        <h2>Icon Creator</h2>

        <section>
          <h4>Choose a Sprite </h4>
          {isLoading ? (
            <button aria-busy="true">Please wait…</button>
          ) : (
            <select onChange={handleChange}>
              {data?.urls.map(({ url }) => {
                return (
                  <option value={url} key={url}>
                    {url}
                  </option>
                );
              })}
            </select>
          )}
        </section>

        <div className="grid">
          <aside>
            {spriteImage && <img src={spriteImage} alt="spriteImage" />}
          </aside>

          <section>
            <form>
              <div className="grid">
                {/* Markup example 1: input is inside label */}
                <label htmlFor="firstname">
                  CSS
                  <textarea
                    id="firstname"
                    name="firstname"
                    placeholder="First name"
                    required
                  />
                </label>
                <label htmlFor="lastname">
                  Last name
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    placeholder="Last name"
                    required
                  />
                </label>
              </div>
              <button type="submit">Submit</button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}
