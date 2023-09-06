import { CSV } from "https://js.sabae.cc/CSV.js";
import { rnd } from "https://js.sabae.cc/rnd.js";

let imgs = null;
const url = "https://code4fukui.github.io/find47/find47images_c.csv";
const init = async () => {
  if (!imgs) {
    imgs = await CSV.fetchJSON(url);
  }
};

export const Find47 = {
  getImage: async (pref = null) => {
    await init();
    const list = pref ? imgs.filter(i => i.pref == pref) : imgs;
    const r = list[rnd(list.length)];
    const url = "https://code4fukui.github.io/find47/photo/" + r.id + ".jpg";
    r.url_image = url;
    r.url = "https://find47.jp/ja/i/" + r.code;
    return r;
  }
};
