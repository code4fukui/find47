# find47 - FIND/47オープンデータ

images data from [FIND/47](https://find47.jp/)

## license - ライセンス

このリポジトリのプログラムコードは [MIT License](LICENSE) です。

一方、`photo/` の画像および `find47images.csv` / `find47images.json` などに掲載している画像データは、各レコードの `author` / `author_en` に記載された作者・提供者によって、[Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) で配布されていたものです。通常版データの `license` カラムはすべて `https://creativecommons.org/licenses/by/4.0/` です。

画像を利用・再配布する場合は、各画像ごとに少なくとも次の情報を表示してください。

- 作者・提供者: `author` または `author_en`
- ライセンス: `https://creativecommons.org/licenses/by/4.0/`
- 出典ページ: `url` または `url_en`（合理的に可能な場合）
- 改変した場合は、その旨

作品名（`title` または `title_en`）も、識別しやすくするため併記することを推奨します。

表記例:

```txt
「能取岬」 by 小西 正敏, FIND/47, CC BY 4.0
https://find47.jp/ja/i/NzJVV
https://creativecommons.org/licenses/by/4.0/
```

CC BY 4.0 では、適切なクレジット、ライセンスへのリンク、改変の有無の表示が必要です。作者・提供者がこのリポジトリや利用者を推奨・承認しているような表示はしないでください。

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
