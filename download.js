import HTMLParser from "https://dev.jspm.io/node-html-parser";
import { Geo3x3 } from "https://taisukef.github.io/Geo3x3/Geo3x3.mjs";
import { CSV } from "https://js.sabae.cc/CSV.js";

/*
    {
      id: 1123,
      code: "DjPSQ",
      url: "https://find47.jp/ja/i/DjPSQ/image_file", // full hd
      thumb_url: "https://find47.jp/ja/i/DjPSQ/image_file?type=thumb", // 960x540
      page_url: "https://find47.jp/ja/i/DjPSQ",
      title: "プユニ岬の眺め",
      prefecture: { code: 1, dn: "hokkaido", name_ja: "北海道", name_en: "Hokkaido" },
      phtotographer: { name: "kkawamura" },
      award: ""
    },

    https://find47.jp/en/i/DjPSQ
      <script type="application/ld+json">
  {
    "@context": "http://schema.org",
    "@type": "Photograph",
    "name": "プユニ岬の眺め",
    "url": "https://find47.jp/ja/i/DjPSQ",
    "creator": "kkawamura",
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "locationCreated": {
      "@type": "Place",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 44.095028,
        "longitude": 145.0092418
      }
    },
    "image": "https://find47.jp/uploads/image_file/content/000/001/123/web.jpg",
    "publisher": {
      "@type": "Organization",
      "url": "https://find47.jp",
      "logo": "https://find47.jp/images/ogp.png",
      "sameAs": [
        "https://www.facebook.com/find47/",
        "https://twitter.com/find47jp",
        "https://www.instagram.com/find47/",
        "https://www.pinterest.jp/find47jp/"
      ]
    }
  }
  https://search.find47.jp/ja/images/DjPSQ/download/s
  https://search.find47.jp/ja/images/DjPSQ/download/m
  https://search.find47.jp/ja/images/DjPSQ/download/l
  https://search.find47.jp/ja/images/DjPSQ/download/xl
  
  </script>
       <h1>北海道 プユニ岬の眺め</h1>
      <ul class="count">
        <li class="view">197</li>
        <li class="download">2065</li>
      </ul>

        <div class="user">
          <div class="name">
            <img src="https://find47.jp/uploads/user/icon/000/000/255/fgQydR8Fzhh191PBDrYcW9ai/003.jpg">
            <a href="https://app.find47.jp/ja/u/1UEau" target="_blank">kkawamura<i></i></a>
          </div>
          <div class="description">
            
          </div>
        </div>

          <div class="shooting-profile">
            <h4>画像撮影詳細</h4>
            <ul>
              <li>カメラ：Canon Canon EOS 5D Mark II</li>
              <li>レンズ：EF100-400mm f/4.5-5.6L IS USM</li>
              <li>撮影日時：2017-04-02 14:16:38 +0900</li>
              <li>ISO感度：200</li>
              <li>露出時間：1/1600</li>
              <li>露光補正値：+1/3</li>
              <li>絞り：5.6</li>
              
              <li>ホワイトバランス：Auto</li>
            </ul>
          </div>

    </div>

    //高解像度
https://search.find47.jp/ja/images/DjPSQ/download/xl?_ga=2.169158371.332883983.1619596891-1359801902.1619596891
Access-Control-Allow-Headers: authorization, content-type, X-XSRF-TOKEN
Access-Control-Allow-Methods: *
Access-Control-Allow-Origin: *
Cache-Control: private
Cache-Control: no-store
Content-Disposition: attachment; filename="hokkaido-Cape_Puyuni-s.zip"
Content-Transfer-Encoding: binary
Content-Type: application/zip
Date: Wed, 28 Apr 2021 21:54:47 GMT
Server: Apache
Status: 200 OK
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-Request-Id: b7466683-bbed-42cf-b734-33412eef1a4b
X-Runtime: 0.231999
X-XSS-Protection: 1; mode=block
transfer-encoding: chunked
Connection: keep-alive
zipがかえる

    */
const url = "https://search.find47.jp/ja/images.json";
const s = await (await fetch(url)).text();
const s2 = await Deno.readTextFile("images.json");
if (s == s2) {
  console.log("no changes");
  Deno.exit(0);
}
await Deno.writeTextFile("images.json", s);
const data = JSON.parse(s);
console.log(data);
const list = [];
await Deno.mkdir("html", { recursive: true });
for (const d of data.images) {
    const readOrFetch = async (url, fn) => {
        try {
            const html = await Deno.readTextFile("html/" + fn + ".html");
            return html;
        } catch (e) {
            const html = await (await fetch (url)).text();
            await Deno.writeTextFile("html/" + fn + ".html", html);
            return html;
        }
    };
    const html = await readOrFetch(d.page_url, d.id);
    const pageurl_en = d.page_url.replace("ja", "en");
    const htmlen = await readOrFetch(pageurl_en, "en_" + d.id);
    console.log(d.id);

    const parseLL = url => url.substring(url.indexOf("q=") + 2, url.indexOf("&"));
    const LEVEL = 18;
    const toGeo3x3 = pos => {
        const ll = pos.split(",");
        return Geo3x3.encode(ll[0], ll[1], LEVEL);
    };
    
    const getJSONLDs = dom => {
        const sc = dom.querySelectorAll("script").filter(s => s.attributes.type == "application/ld+json");
        return sc.map(s => JSON.parse(s.childNodes[0].rawText));
    };
    const getLicense = ar => {
        for (const a of ar) {
            if (a && a.license) {
                return a.license;
            }
        }
        return null;
    };

    const dom = HTMLParser.parse(html);
    //const title = dom.querySelector("h1").text;
    const param = dom.querySelectorAll(".shooting-profile li").map(li => li.text);
    const pos = toGeo3x3(parseLL(dom.querySelector(".show-gmap a").attributes.href));
    const countView = dom.querySelector(".count .view").text;
    const countDownload = dom.querySelector(".count .download").text;
    const authorurl = dom.querySelector(".user .name a")?.attributes.href || "";
    const license = getLicense(getJSONLDs(dom));
    if (!license) {
        console.log(d.page_url);
        Deno.exit(0);
    }

    const domen = HTMLParser.parse(htmlen);
    const titleen = domen.querySelector("h1").text;
    const authorurl_en = domen.querySelector(".user .name a")?.attributes.href || "";
    const author_en = domen.querySelector(".user .name a")?.text || domen.querySelector(".photographer")?.text || d.phtotographer.name;

    const d2 = {
        id: d.id,
        code: d.code,
        url: d.page_url,
        url_en: pageurl_en,
        url_image: d.url,
        url_thumb: d.thumb_url,
        title: d.title,
        title_en: titleen,
        pref_code: d.prefecture.code,
        pref: d.prefecture.name_ja,
        pref_en: d.prefecture.name_en,
        author: d.phtotographer.name,
        author_en: author_en,
        authorurl: authorurl,
        authorurl_en: authorurl_en,
        license: license,
        award: d.award,
        count_view: countView,
        count_download: countDownload,
    };
    const exif = {
        "カメラ": "camera",
        "レンズ": "lens",
        "撮影日時": "date_shot",
        "ISO感度": "iso",
        "露出時間": "exposure_time",
        "露光補正値": "exposure_bias",
        "焦点距離": "focus_length",
        "絞り": "lens_f",
        "ホワイトバランス": "whiteblance"
    }
    for (const p of param) {
        const n = p.indexOf("：");
        const name = p.substring(0, n);
        const namee = exif[name] || name;
        const val = p.substring(n + 1);
        d2[namee] = val;
    }
    d2.Geo3x3 = pos;
    console.log(d2);
    list.push(d2);
}
list.sort((a, b) => parseInt(a.id) - parseInt(b.id));
await Deno.writeTextFile("find47images.csv", CSV.encode(CSV.fromJSON(list)));

await import("./makeCompact.js");
await import("./makeJSON.js");
