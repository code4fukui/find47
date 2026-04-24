# find47

> Japanese README: [README.ja.md](README.ja.md)

Open data images from [FIND/47](https://find47.jp/).

## License

The program code in this repository is licensed under the [MIT License](LICENSE).

The images in `photo/` and the image metadata in `find47images.csv` / `find47images.json` were distributed by the authors or providers listed in `author` / `author_en` under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). In the standard dataset, all values in the `license` column are `https://creativecommons.org/licenses/by/4.0/`.

When using or redistributing an image, provide at least:

- author or provider: `author` or `author_en`
- license: `https://creativecommons.org/licenses/by/4.0/`
- source page: `url` or `url_en` when reasonably practicable
- indication of modifications, if any

Including the title (`title` or `title_en`) is also recommended for easier identification.

Example attribution:

```txt
"Cape Notoro" by Masatoshi Konishi, FIND/47, CC BY 4.0
https://find47.jp/en/i/NzJVV
https://creativecommons.org/licenses/by/4.0/
```

## Open Data

- [find47images.csv](https://github.com/code4fukui/find47/blob/main/find47images.csv)
- [find47images.json](https://github.com/code4fukui/find47/blob/main/find47images.json)
- [find47images_c.csv](https://github.com/code4fukui/find47/blob/main/find47images_c.csv) compact / lightweight
- [find47images_c.json](https://github.com/code4fukui/find47/blob/main/find47images_c.json) compact / lightweight

```js
const data = await (await fetch("https://code4fukui.github.io/find47/find47images_c.json")).json();
const photo = data.find((d) => d.id == 4034);
console.log(photo);
```

## Sample Apps

- [Photo Search](https://code4fukui.github.io/find47/search.html)
- [Photo List](https://code4fukui.github.io/find47/)
- [Map](https://code4fukui.github.io/find47/map.html)
- [Nearby Scenic Spots Search](https://code4fukui.github.io/find47/nearby.html)
- [Saigaikun](https://github.com/code4fukui/saigaikun)
- [Fukui Tourism App](https://github.com/code4fukui/fukui-kanko/)
