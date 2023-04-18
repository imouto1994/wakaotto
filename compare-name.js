const fsPromise = require("fs/promises");
const path = require("path");
const { glob } = require("glob");

const NAME_LIST = [
  // First names
  ["拓也", "Takuya"],
  ["沙耶", "Saya"],
  ["香織", "Kaori"],
  ["乙葉", "Otoha"],
  ["由紀", "Yuki"],
  ["律子", "Ritsuko"],
  ["隆司", "Takashi"],
  ["松太郎", "Matsutarou"],
  ["昭彦", "Akihiko"],
  ["時江", "Tokie"],
  // Last names
  ["三澤", "Misawa"],
  ["進藤", "Shindou"],
  ["沢木", "Sawaki"],
  ["志田", "Shida"],
];

(async () => {
  const translatedFilePaths = await glob("clean-temp/*.txt");
  translatedFilePaths.sort((s1, s2) => (s1 < s2) - (s1 > s2));
  for (const translatedFilePath of translatedFilePaths) {
    const [, translatedFileName] = translatedFilePath.split("/");
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

    let reviewRequired = false;
    for (let i = 0; i < originalFileLines.length; i++) {
      const originalLine = originalFileLines[i];
      const translatedLine = translatedFileLines[i];

      // Name suffixes check
      for (const nameEntries of NAME_LIST) {
        const japaneseNameCount = (
          originalLine.match(new RegExp(nameEntries[0], "g")) || []
        ).length;
        const translatedNameCount = (
          translatedLine.match(new RegExp(nameEntries[1], "g")) || []
        ).length;

        if (japaneseNameCount !== translatedNameCount) {
          reviewRequired = true;
          console.log(i + 1, nameEntries, originalLine, translatedLine);
        }
      }
    }
    if (reviewRequired) {
      console.log("FILE NAME:", translatedFileName);
    }
  }
})();
