import { CSV } from "https://js.sabae.cc/CSV.js";

const list = CSV.toJSON(await CSV.fetch("find47images.csv"));
const compact = list.map(l => {
  return { id: l.id, code: l.code, pref: l.pref, title: l.title, Geo3x3: l.Geo3x3 }
});
await Deno.writeTextFile("find47images_c.csv", CSV.encode(CSV.fromJSON(compact)));
