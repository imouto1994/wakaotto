const { constants } = require("fs");
const fsPromise = require("fs/promises");
const path = require("path");
const { glob } = require("glob");

(async () => {
  const translatedFilePaths = await glob("clean-final/*.txt");
  translatedFilePaths.sort((s1, s2) => (s1 > s2) - (s1 < s2));

  for (const translatedFilePath of translatedFilePaths) {
    const [, translatedFileName] = translatedFilePath.split("/");
    const choicesFilePath = `choices/${translatedFileName}.json`;
    const originalFilePath = `otto_output/${translatedFileName}`;

    try {
      await fsPromise.access(choicesFilePath, constants.F_OK);
      console.log("_______________________________________________");
      console.log(`clean-final/${translatedFileName}`, "Choices exist");
    } catch (err) {
      continue;
    }

    const originalFileContent = await fsPromise.readFile(originalFilePath, {
      encoding: "utf-8",
    });
    const originalFileLines = originalFileContent
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const translatedFileContent = await fsPromise.readFile(translatedFilePath, {
      encoding: "utf-8",
    });
    const translatedFileLines = translatedFileContent
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const choices = JSON.parse(
      await fsPromise.readFile(choicesFilePath, {
        encoding: "utf-8",
      })
    );

    if (originalFileLines.length !== translatedFileLines.length) {
      console.log(
        "MISMATCHED LINE COUNTS",
        "ORIGINAL COUNT:",
        originalFileLines.length,
        "TRANSLATED COUNT:",
        translatedFileLines.length
      );
      console.log("FILE NAME:", translatedFileName);
      break;
    }

    for (let i = 0; i < originalFileLines.length; i++) {
      const originalLine = originalFileLines[i];
      const translatedLine = translatedFileLines[i];
      if (choices.some((choice) => choice === originalLine)) {
        if (translatedLine.endsWith(".")) {
          console.log("DOT", i + 1, translatedLine);
        }
        if (translatedLine.length > 46) {
          console.log(
            "EXCEEDED LIMIT",
            i + 1,
            translatedLine.length,
            translatedLine
          );
        }
      }
    }
  }
})();
