const { constants } = require("fs");
const fsPromise = require("fs/promises");
const path = require("path");
const { glob } = require("glob");

// Compare diff between normal file and corresponding _m file (if exists)
(async () => {
  const filePaths = await glob("otto_output/*.txt");
  filePaths.sort((s1, s2) => (s1 > s2) - (s1 < s2));

  let count = 0;
  for (const filePath of filePaths) {
    const [, fileName] = filePath.split("/");
    const alternativeFilePath = filePath.replace(".txt", "_m.txt");

    try {
      await fsPromise.access(alternativeFilePath, constants.F_OK);
    } catch (err) {
      continue;
    }

    const fileContent = await fsPromise.readFile(filePath, {
      encoding: "utf-8",
    });
    const alternativeFileContent = await fsPromise.readFile(
      alternativeFilePath,
      {
        encoding: "utf-8",
      }
    );

    const lines = fileContent
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const alternativeLines = alternativeFileContent
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (lines.length !== alternativeLines.length) {
      console.log(
        "MISMATCHED LINE COUNTS",
        "LINES COUNT:",
        lines.length,
        "ALT LINES COUNT:",
        alternativeLines.length
      );
      console.log("FILE NAME:", fileName);
      console.log("---------------------------------------------");
      count++;
      continue;
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const alternativeLine = alternativeLines[i];
      if (line !== alternativeLine) {
        console.log("MISMATCHED LINE", i, line, alternativeLine);
        console.log("FILE NAME:", fileName);
        console.log("---------------------------------------------");
        count++;
        break;
      }
    }
  }
  console.log("COUNT", count);
})();
