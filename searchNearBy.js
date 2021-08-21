import { CSV } from "https://js.sabae.cc/CSV.js";
import { getDistance } from "https://js.sabae.cc/getDistance.js";
import { Geo3x3 } from "https://geo3x3.com/Geo3x3.js";

let imglist = null;

export const searchNearBy = async (lat, lng, radiuskm) => {
	if (!imglist) {
		imglist = CSV.toJSON(await CSV.fetch("https://code4fukui.github.io/find47/find47images_c.csv"));
		//console.log(imglist);
	}
	return imglist.filter(i => {
		const ll = Geo3x3.decode(i.Geo3x3);
		const d = getDistance(lat, lng, ll.lat, ll.lng);
		return d < radiuskm;
	}).map(i => {
		const ll = Geo3x3.decode(i.Geo3x3);
		const distance = getDistance(lat, lng, ll.lat, ll.lng);
		// 1,NzJVV,https://find47.jp/ja/i/NzJVV,https://find47.jp/en/i/NzJVV,https://find47.jp/ja/i/NzJVV/image_file,https://find47.jp/ja/i/NzJVV/image_file?type=thumb,能取岬,Cape Notoro Hokkaido,1,北海道,Hokkaido,小西 正敏,Masatoshi Konishi,,,https://creativecommons.org/licenses/by/4.0/,,1980,5440,E92726315617716464,,,,,,,,,

		return {
			title: i.title,
			Geo3x3: i.Geo3x3,
			distance,
			url: `https://find47.jp/ja/i/${i.code}`,
			url_thumb: `https://find47.jp/ja/i/${i.code}/image_file?type=thumb`,
		}
	});
};
