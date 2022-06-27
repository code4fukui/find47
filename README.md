# find47 - FIND/47オープンデータ

images data from [FIND/47](https://find47.jp/)

## opendata - オープンデータ

- [find47images.csv](https://github.com/code4fukui/find47/blob/main/find47images.csv)
- [find47images.json](https://github.com/code4fukui/find47/blob/main/find47images.json)
- [find47images_c.csv](https://github.com/code4fukui/find47/blob/main/find47images_c.csv) compact / 軽量版
- [find47images_c.json](https://github.com/code4fukui/find47/blob/main/find47images_c.json) compact / 軽量版

```js
const data = await (await fetch("https://code4fukui.github.io/find47/find47images_c.json")).json();
const pref = data.find(d => d.id == 4034);
console.log("この写真は" + pref);
```

## sample app - サンプルアプリ

- [写真検索](https://code4fukui.github.io/find47/search.html)
- [写真一覧](https://code4fukui.github.io/find47/)
- [マップ](https://code4fukui.github.io/find47/map.html)
- [近くのステキ風景検索](https://code4fukui.github.io/find47/nearby.html)
- [サイガイクン](https://github.com/code4fukui/saigaikun)
- [福井の観光アプリ](https://github.com/code4fukui/fukui-kanko/)
