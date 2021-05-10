import { CSV } from "https://js.sabae.cc/CSV.js";

const isExists = async (fn) => {
  try {
    return (await Deno.stat(fn)).isFile;
  } catch (e) {
  }
  return false;
};

const data = CSV.toJSON(CSV.decode(await Deno.readTextFile("find47images.csv")));
await Deno.mkdir("photo", { recursive: true });
for (const d of data) {
  console.log(d.url_image);
  const fn = "photo/" + d.id + ".jpg";
  if (await isExists(fn)) {
    continue;
  }
  const bin = new Uint8Array(await (await fetch(d.url_image)).arrayBuffer());
  await Deno.writeFile(fn, bin);
}
