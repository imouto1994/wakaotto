const fsPromise = require("fs/promises");
const path = require("path");
const { glob } = require("glob");

(async () => {
  const translatedFilePaths = await glob("clean-temp/*.txt");
  translatedFilePaths.sort((s1, s2) => (s1 < s2) - (s1 > s2));
  const nameMap = {};
  for (const translatedFilePath of translatedFilePaths) {
    const translatedFileContent = await fsPromise.readFile(translatedFilePath, {
      encoding: "utf-8",
    });
    const translatedFileLines = translatedFileContent
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const line of translatedFileLines) {
      const matches = line.match(/^(.*): ".*$/);
      if (matches != null) {
        const name = matches[1];
        if (nameMap[name] == null) {
          nameMap[name] = 0;
        }
        nameMap[name]++;
      }
    }
  }
  console.log(
    Object.entries(nameMap).sort(([, c1], [, c2]) => (c1 < c2) - (c1 > c2))
  );
})();
