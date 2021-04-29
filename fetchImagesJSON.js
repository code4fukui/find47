const url = "https://search.find47.jp/ja/images.json";

const read = async (fn) => {
  try {
    return await Deno.readTextFile(fn);
  } catch (e) {
  }
  return null;
};

const json = await (await fetch(url)).text();
const bkjson = await read("images.json");
if (json != bkjson) {
  await Deno.writeTextFile("images.json", json);
  console.log("some updated!");
  console.log("run download and downloadPhoto");
} else {
  console.log("no updated...");
}
