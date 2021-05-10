import { sleep } from "https://js.sabae.cc/sleep.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

/*
const cls = async (color) => {
	document.body.style.backgroundColor = color || "black";
	await sleep(100);
};
*/
const waitImageLoad = async (img) => {
	return new Promise((resolve) => {
		img.onload = () => {
			resolve(img);
		};
	});
};

let imglist = null;
const bg = async (no, nowait) => {
	if (!imglist) {
		imglist = CSV.toJSON(await CSV.fetch("https://code4fukui.github.io/find47/find47images.csv"));
		console.log(imglist);
	}
	const data = imglist.find(i => i.id == no);
	if (!data) {
		return;
	}
	const img = new Image();
	img.src = data.url_image;
	await waitImageLoad(img);
	//document.body.style.backgroundImage = `url('${url}'), url("./man.png")`;
	document.body.style.backgroundColor = "black";
	document.body.style.backgroundImage = `url('${data.url_image}')`;
	document.body.style.backgroundRepeat = "no-repeat";
	document.body.style.backgroundSize = "100% auto";

	const get = (id) => {
		const c = document.getElementById(id);
		if (c) {
			return c;
		}
		const c2 = document.createElement("a");
		c2.id = id;
		document.body.appendChild(c2);
		return c2;
	};
	const div = get("find47_bg_credit");
	div.style.position = "absolute";
	div.style.right = ".2em";
	div.style.bottom = ".2em";
	div.href = data.url;
	div.style.textDecoration = "none";
	div.textContent = data.title + " © " + data.author + " クリエイティブ・コモンズ・ライセンス（表示4.0 国際）";
	div.style.color = "white";
	div.style.fontSize = "70%";
	if (!nowait) {
		await sleep(1000);
	}
	/*
	document.body.style.backgroundImage = `url("./man.png")`;
	document.body.style.backgroundImage = `url("./man.png")`;
	document.body.style.backgroundSize = "auto 50%";
	document.body.style.backgroundPosition = "20% 100%";
	*/
};

export { bg };
