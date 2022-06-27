import { CSV } from "https://js.sabae.cc/CSV.js";

export const csv2json = async (fn) => {
  const data = CSV.toJSON(await CSV.fetch(fn));
  await Deno.writeTextFile(fn.replace(".csv", ".json"), JSON.stringify(data, null, 2));
};
