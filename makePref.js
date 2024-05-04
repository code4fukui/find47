import { CSV } from "https://js.sabae.cc/CSV.js";
import { JAPAN_PREF_ISO, JAPAN_PREF } from "https://js.sabae.cc/JAPAN_PREF.js";

const data = await CSV.fetchJSON("./find47images.csv");
for (let i = 0; i < JAPAN_PREF.length; i++) {
  const id = JAPAN_PREF_ISO[i];
  const pref = JAPAN_PREF[i];
  const d = data.filter(i => i.pref == pref);
  await Deno.writeTextFile("pref/find47images_" + id + ".csv", CSV.stringify(d));
}
