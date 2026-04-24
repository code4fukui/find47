const usage = `Usage:
  deno run --allow-read --allow-write deleteByAuthor.js <author> [options]

Options:
  -n, --dry-run          Show what would be changed without writing files.
  --contains            Match author by substring instead of exact match.
  --field=<field>       Match field: author, author_en, or both. Default: both.
  --no-pref             Do not update pref/*.csv files.
  -h, --help            Show this help.
`;

const args = Deno.args;
let author = "";
let dryRun = false;
let contains = false;
let field = "both";
let updatePref = true;

for (const arg of args) {
  if (arg == "-h" || arg == "--help") {
    console.log(usage);
    Deno.exit(0);
  } else if (arg == "-n" || arg == "--dry-run") {
    dryRun = true;
  } else if (arg == "--contains") {
    contains = true;
  } else if (arg == "--no-pref") {
    updatePref = false;
  } else if (arg.startsWith("--field=")) {
    field = arg.substring("--field=".length);
  } else if (!author) {
    author = arg;
  } else {
    console.error(`Unexpected argument: ${arg}`);
    console.error(usage);
    Deno.exit(1);
  }
}

if (!author) {
  console.error("author is required.");
  console.error(usage);
  Deno.exit(1);
}
if (!["author", "author_en", "both"].includes(field)) {
  console.error("--field must be author, author_en, or both.");
  Deno.exit(1);
}

const fileExists = async (path) => {
  try {
    await Deno.stat(path);
    return true;
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      return false;
    }
    throw e;
  }
};

const parseCSV = (text) => {
  const bom = text.startsWith("\uFEFF");
  if (bom) {
    text = text.substring(1);
  }
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c == '"') {
        if (text[i + 1] == '"') {
          value += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        value += c;
      }
    } else if (c == '"') {
      quoted = true;
    } else if (c == ",") {
      row.push(value);
      value = "";
    } else if (c == "\n") {
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else if (c != "\r") {
      value += c;
    }
  }
  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  const headers = rows.shift() ?? [];
  return {
    bom,
    headers,
    records: rows.filter((r) => r.length > 1 || r[0] != "").map((r) => {
      const record = {};
      for (let i = 0; i < headers.length; i++) {
        record[headers[i]] = r[i] ?? "";
      }
      return record;
    }),
  };
};

const escapeCSV = (value) => {
  value = value == null ? "" : String(value);
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
};

const stringifyCSV = ({ bom, headers, records }) => {
  const lines = [
    headers.map(escapeCSV).join(","),
    ...records.map((record) =>
      headers.map((h) => escapeCSV(record[h])).join(",")
    ),
  ];
  return (bom ? "\uFEFF" : "") + lines.join("\n") + "\n";
};

const readCSV = async (path) => parseCSV(await Deno.readTextFile(path));

const writeCSV = async (path, data) => {
  if (!dryRun) {
    await Deno.writeTextFile(path, stringifyCSV(data));
  }
};

const matchAuthor = (record) => {
  const target = author.trim();
  const fields = field == "both" ? ["author", "author_en"] : [field];
  return fields.some((f) => {
    const value = (record[f] ?? "").trim();
    return contains ? value.includes(target) : value == target;
  });
};

const removeIdsFromCSV = async (path, ids) => {
  if (!await fileExists(path)) {
    return { path, before: 0, after: 0, removed: 0, skipped: true };
  }
  const data = await readCSV(path);
  const before = data.records.length;
  data.records = data.records.filter((record) => !ids.has(record.id));
  const after = data.records.length;
  if (before != after) {
    await writeCSV(path, data);
  }
  return { path, before, after, removed: before - after };
};

const removeIdsFromJSON = async (path, ids) => {
  if (!await fileExists(path)) {
    return { path, before: 0, after: 0, removed: 0, skipped: true };
  }
  const list = JSON.parse(await Deno.readTextFile(path));
  if (!Array.isArray(list)) {
    throw new Error(`${path} is not a JSON array.`);
  }
  const before = list.length;
  const filtered = list.filter((record) => !ids.has(record.id));
  const after = filtered.length;
  if (before != after && !dryRun) {
    await Deno.writeTextFile(path, JSON.stringify(filtered, null, 2));
  }
  return { path, before, after, removed: before - after };
};

const listPrefCSV = async () => {
  if (!updatePref || !await fileExists("pref")) {
    return [];
  }
  const files = [];
  for await (const entry of Deno.readDir("pref")) {
    if (entry.isFile && entry.name.endsWith(".csv")) {
      files.push(`pref/${entry.name}`);
    }
  }
  return files.sort();
};

const removeHTML = async (ids) => {
  const results = [];
  for (const id of ids) {
    for (const path of [`html/${id}.html`, `html/en_${id}.html`]) {
      if (!await fileExists(path)) {
        results.push({ path, removed: 0, skipped: true });
        continue;
      }
      if (!dryRun) {
        await Deno.remove(path);
      }
      results.push({ path, removed: 1 });
    }
  }
  return results;
};

const removePhotos = async (ids) => {
  const results = [];
  for (const id of ids) {
    const path = `photo/${id}.jpg`;
    if (!await fileExists(path)) {
      results.push({ path, removed: 0, skipped: true });
      continue;
    }
    if (!dryRun) {
      await Deno.remove(path);
    }
    results.push({ path, removed: 1 });
  }
  return results;
};

const main = await readCSV("find47images.csv");
const targets = main.records.filter(matchAuthor);
const ids = new Set(targets.map((record) => record.id));

if (ids.size == 0) {
  console.log(`No records matched author: ${author}`);
  Deno.exit(0);
}

const csvFiles = [
  "find47images.csv",
  "find47images_c.csv",
  ...await listPrefCSV(),
];
const jsonFiles = [
  "find47images.json",
  "find47images_c.json",
];

const csvResults = [];
for (const path of csvFiles) {
  csvResults.push(await removeIdsFromCSV(path, ids));
}

const jsonResults = [];
for (const path of jsonFiles) {
  jsonResults.push(await removeIdsFromJSON(path, ids));
}

const htmlResults = await removeHTML(ids);
const photoResults = await removePhotos(ids);

const prefix = dryRun ? "[dry-run] " : "";
console.log(`${prefix}matched ${ids.size} record(s) for author: ${author}`);
for (const record of targets) {
  console.log(
    `  id=${record.id} title=${record.title} author=${record.author} author_en=${record.author_en}`,
  );
}

console.log("\nCSV:");
for (const result of csvResults) {
  if (
    result.removed > 0 || result.path == "find47images.csv" ||
    result.path == "find47images_c.csv"
  ) {
    console.log(
      `  ${result.path}: ${result.before} -> ${result.after} (${result.removed} removed)`,
    );
  }
}

console.log("\nJSON:");
for (const result of jsonResults) {
  console.log(
    `  ${result.path}: ${result.before} -> ${result.after} (${result.removed} removed)`,
  );
}

const removedHTML = htmlResults.filter((result) => result.removed).length;
console.log(
  `\nHTML: ${removedHTML} file(s) ${dryRun ? "would be removed" : "removed"}`,
);

const removedPhotos = photoResults.filter((result) => result.removed).length;
console.log(
  `Photo: ${removedPhotos} file(s) ${dryRun ? "would be removed" : "removed"}`,
);
