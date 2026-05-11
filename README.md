# find47

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

This repository provides an open dataset of scenic photos from across Japan, sourced from the [FIND/47](https://find47.jp/) project. It includes scripts to automatically scrape and update the data, as well as sample applications to demonstrate its use.

## Demos

- **[Photo List](https://code4fukui.github.io/find47/)**: An endless-scrolling gallery of all photos.
- **[Photo Search](https://code4fukui.github.io/find47/search.html)**: Search for photos by keyword.
- **[Map](https://code4fukui.github.io/find47/map.html)**: View all photos on an interactive map.
- **[Nearby Scenic Spots Search](https://code4fukui.github.io/find47/nearby.html)**: Find scenic spots near your current location.

## Features

- **Comprehensive Datasets**: Available in CSV and JSON, with full and compact versions. Includes metadata like titles, authors, EXIF data, and geolocation.
- **High-Quality Images**: A collection of photos from all 47 prefectures of Japan, stored in the `photo/` directory.
- **Automated Updates**: Scripts to periodically check for new images and update the dataset.
- **Ready-to-Use Demos**: Includes web apps for searching, mapping, and discovering photos.
- **Open License**: All images are licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), making them easy to reuse with proper attribution.

## Datasets

The data is available in both full and compact (lightweight) versions.

- **Full version**:
  - [find47images.csv](https://github.com/code4fukui/find47/blob/main/find47images.csv)
  - [find47images.json](https://github.com/code4fukui/find47/blob/main/find47images.json)
- **Compact version**:
  - [find47images_c.csv](https://github.com/code4fukui/find47/blob/main/find47images_c.csv)
  - [find47images_c.json](https://github.com/code4fukui/find47/blob/main/find47images_c.json)

### Usage Example

You can fetch the compact JSON data directly in your web application:

```js
const data = await (await fetch("https://code4fukui.github.io/find47/find47images_c.json")).json();
const photo = data.find((d) => d.id == 4034);
console.log(photo);
```

### Data Schema

The compact dataset (`find47images_c.csv`) contains essential fields for lightweight applications:
- `id`: Unique identifier for the image.
- `code`: Shortcode used by FIND/47.
- `pref`: Prefecture in Japanese.
- `title`: Title in Japanese.
- `author`: Author's name in Japanese.
- `Geo3x3`: Geolocation code.

The full dataset (`find47images.csv`) includes additional fields such as English translations (`title_en`, `author_en`), URLs, view/download counts, and detailed EXIF data (camera, lens, date shot, etc.).

## License and Attribution

The program code in this repository is licensed under the [MIT License](LICENSE).

The images in `photo/` and their metadata are distributed under the [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) license by the authors listed in the `author` / `author_en` fields.

When using or redistributing an image, you must provide proper attribution. Please include at least:

- **Author/Provider**: `author` or `author_en`
- **License**: `https://creativecommons.org/licenses/by/4.0/`
- **Source Page**: `url` or `url_en` (when reasonably practicable)
- **Indication of modifications**, if any.

Including the title (`title` or `title_en`) is also recommended for easier identification.

**Example Attribution:**
```txt
"Cape Notoro" by Masatoshi Konishi, FIND/47, CC BY 4.0
https://find47.jp/en/i/NzJVV
https://creativecommons.org/licenses/by/4.0/
```

## For Developers

### Data Update Process

The dataset is kept up-to-date using a series of Deno scripts:
1.  `download.js`: Scrapes `find47.jp` to get the latest image metadata and generates `find47images.csv`.
2.  `downloadPhoto.js`: Downloads the corresponding image files into the `photo/` directory.
3.  `makeCompact.js` & `makeJSON.js`: Generate the compact and JSON versions of the dataset.

To run the update process:
```sh
deno run -A download.js
deno run -A downloadPhoto.js
```

### Utilities

- `deleteByAuthor.js`: A command-line tool to remove all data and images associated with a specific author. This is useful for processing data removal requests.

### Sample Applications

This dataset is used in other projects, such as:
- [Saigaikun](https://github.com/code4fukui/saigaikun)
- [Fukui Tourism App](https://github.com/code4fukui/fukui-kanko/)