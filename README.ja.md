# find47

このリポジトリは、[FIND/47](https://find47.jp/)プロジェクトから収集された、日本全国の風景写真のオープンデータセットを提供します。データの自動スクレイピングと更新を行うスクリプトや、その活用例を示すサンプルアプリケーションも含まれています。

## デモ

- **[写真一覧](https://code4fukui.github.io/find47/)**: 全写真を無限スクロールで表示するギャラリー。
- **[写真検索](https://code4fukui.github.io/find47/search.html)**: キーワードで写真を検索。
- **[地図](https://code4fukui.github.io/find47/map.html)**: すべての写真をインタラクティブな地図上で表示。
- **[周辺風景スポット検索](https://code4fukui.github.io/find47/nearby.html)**: 現在地周辺の風景スポットを検索。

## 特徴

- **包括的なデータセット**: CSVおよびJSON形式で提供され、フル版とコンパクト版があります。タイトル、著作者、EXIFデータ、地理情報などのメタデータが含まれています。
- **高品質な画像**: 日本の47都道府県すべての写真コレクションが `photo/` ディレクトリに保存されています。
- **自動更新**: 新しい画像を定期的にチェックし、データセットを更新するスクリプトが含まれています。
- **すぐに使えるデモ**: 写真の検索、地図表示、発見のためのWebアプリが含まれています。
- **オープンライセンス**: すべての画像は [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) ライセンスの下で提供されており、適切なクレジット表記を行うことで簡単に再利用できます。

## データセット

データはフル版とコンパクト（軽量）版の両方で提供されています。

- **フル版**:
  - [find47images.csv](https://github.com/code4fukui/find47/blob/main/find47images.csv)
  - [find47images.json](https://github.com/code4fukui/find47/blob/main/find47images.json)
- **コンパクト版**:
  - [find47images_c.csv](https://github.com/code4fukui/find47/blob/main/find47images_c.csv)
  - [find47images_c.json](https://github.com/code4fukui/find47/blob/main/find47images_c.json)

### 使用例

Webアプリケーション内でコンパクト版のJSONデータを直接取得して利用できます。

```js
const data = await (await fetch("https://code4fukui.github.io/find47/find47images_c.json")).json();
const photo = data.find((d) => d.id == 4034);
console.log(photo);
```

### データスキーマ

コンパクト版データセット（`find47images_c.csv`）には、軽量アプリケーション向けの必須フィールドが含まれています。
- `id`: 画像の一意の識別子。
- `code`: FIND/47で使用されるショートコード。
- `pref`: 都道府県（日本語）。
- `title`: タイトル（日本語）。
- `author`: 著作者名（日本語）。
- `Geo3x3`: 地理情報コード。

フル版データセット（`find47images.csv`）には、英語訳（`title_en`、`author_en`）、URL、閲覧/ダウンロード数、詳細なEXIFデータ（カメラ、レンズ、撮影日時など）といった追加フィールドが含まれています。

## ライセンスとクレジット表記

このリポジトリ内のプログラムコードは、[MIT License](LICENSE) の下でライセンスされています。

`photo/` 内の画像およびそのメタデータは、`author` / `author_en` フィールドに記載された著作者によって、[Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) ライセンスの下で配布されています。

画像を利用または再配布する際は、適切なクレジット表記を行う必要があります。少なくとも以下の情報を含めてください。

- **著作者/提供者**: `author` または `author_en`
- **ライセンス**: `https://creativecommons.org/licenses/by/4.0/`
- **ソースページ**: `url` または `url_en`（合理的に可能な場合）
- **変更の有無**: 変更を加えた場合はその旨

識別しやすくするため、タイトル（`title` または `title_en`）を含めることも推奨されます。

**クレジット表記例：**
```txt
"Cape Notoro" by Masatoshi Konishi, FIND/47, CC BY 4.0
https://find47.jp/en/i/NzJVV
https://creativecommons.org/licenses/by/4.0/
```

## 開発者向け

### データ更新プロセス

データセットは、一連のDenoスクリプトを使用して最新の状態に保たれます。
1.  `download.js`: `find47.jp` をスクレイピングして最新の画像メタデータを取得し、`find47images.csv` を生成します。
2.  `downloadPhoto.js`: 対応する画像ファイルを `photo/` ディレクトリにダウンロードします。
3.  `makeCompact.js` & `makeJSON.js`: コンパクト版およびJSON版のデータセットを生成します。

更新プロセスを実行するには：
```sh
deno run -A download.js
deno run -A downloadPhoto.js
```

### ユーティリティ

- `deleteByAuthor.js`: 特定の著作者に関連するすべてのデータと画像を削除するためのコマンドラインツールです。データ削除リクエストの処理に役立ちます。

### サンプルアプリケーション

このデータセットは、以下のような他のプロジェクトでも使用されています。
- [Saigaikun](https://github.com/code4fukui/saigaikun)
- [Fukui Tourism App](https://github.com/code4fukui/fukui-kanko/)
