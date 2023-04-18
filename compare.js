const fsPromise = require("fs/promises");
const path = require("path");
const { glob } = require("glob");

(async () => {
  const translatedFilePaths = await glob("clean/*.txt");
  translatedFilePaths.sort((s1, s2) => (s1 < s2) - (s1 > s2));
  for (const translatedFilePath of translatedFilePaths) {
    const [, translatedFileName] = translatedFilePath.split("/");
    if (translatedFileName.startsWith("temp_")) {
      continue;
    }
    const originalFilePath = `output/${translatedFileName}`;

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

    let needReview = false;
    for (
      let i = 0;
      i < Math.min(originalFileLines.length, translatedFileLines.length);
      i++
    ) {
      const originalLine = originalFileLines[i];
      const translatedLine = translatedFileLines[i];
      if (
        (originalLine.includes(":") && !translatedLine.includes(":")) ||
        (!originalLine.includes(":") && translatedLine.match(/^.*:.*".+$/))
      ) {
        for (let j = 0; j <= i; j++) {
          console.log(j + 1, originalFileLines[j], translatedFileLines[j]);
        }
        needReview = true;
        console.log(
          "DIFF LINE:",
          i + 1,
          "ORIGINAL COUNT:",
          originalFileLines.length,
          "TRANSLATED COUNT:",
          translatedFileLines.length
        );
        break;
      }
    }
    if (needReview || originalFileLines.length !== translatedFileLines.length) {
      console.log(
        "ORIGINAL COUNT:",
        originalFileLines.length,
        "TRANSLATED COUNT:",
        translatedFileLines.length
      );
      console.log("FILE NAME:", translatedFileName);
    }
  }
})();
