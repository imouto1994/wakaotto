const fsPromise = require("fs/promises");
const path = require("path");
const { glob } = require("glob");

const PREFIX = "otto";

// Example:［優作］：はあっ…。
(async () => {
  const jsonFilePaths = await glob(`${PREFIX}_json/*.json`);
  let totalCharCount = 0;
  let totalGroups = 0;
  for (const jsonFilePath of jsonFilePaths) {
    const jsonFileContent = await fsPromise.readFile(jsonFilePath, {
      encoding: "utf-8",
    });
    const entries = JSON.parse(jsonFileContent);
    const lines = entries.map((entry, index) => {
      const line = entry.message;
      if (line.startsWith("［")) {
        const matches = line.match(/^\［(.+?)\］\：(.*)$/);
        if (matches == null) {
          console.error("UNIDENTIFIED FORMAT", index, line);
          return line;
        }
        return `${matches[1]}：「${matches[2]}」`;
      }

      return `（${line}）`;
    });

    const charCount = lines.reduce((count, line) => count + line.length, 0);
    console.log(`CHAR COUNT: ${Number(charCount).toLocaleString()}.`);
    totalCharCount += charCount;
    totalGroups++;

    const text = lines.join("\n");
    await fsPromise.writeFile(
      jsonFilePath
        .replace(`${PREFIX}_json/`, `${PREFIX}_output/`)
        .replace(".json", ".txt"),
      text
    );
  }
  console.log(`TOTAL: ${Number(totalCharCount).toLocaleString()}.`);
})();
