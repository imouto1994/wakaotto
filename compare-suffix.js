const fsPromise = require("fs/promises");
const path = require("path");
const { glob } = require("glob");
const prompts = require("prompts");

const CHAN_LIST = [
  ["沙耶ちゃん", "Saya-chan", ["Saya"]],
  ["香織ちゃん", "Kaori-chan", ["Kaori"]],
  ["乙葉ちゃん", "Otoha-chan", ["Otoha"]],
  ["由紀ちゃん", "Yuki-chan", ["Yuki"]],
  ["律子ちゃん", "Ritsuko-chan", ["Ritsuko"]],
];
const SAN_LIST = [
  // First names
  ["拓也さん", "Takuya-san", ["Takuya"]],
  ["沙耶さん", "Saya-san", ["Saya"]],
  ["香織さん", "Kaori-san", ["Kaori"]],
  ["乙葉さん", "Otoha-san", ["Otoha"]],
  ["由紀さん", "Yuki-san", ["Yuki"]],
  ["律子さん", "Ritsuko-san", ["Ritsuko"]],
  ["隆司さん", "Takashi-san", ["Takashi"]],
  ["松太郎さん", "Matsutarou-san", ["Matsutarou"]],
  ["昭彦さん", "Akihiko-san", ["Akihiko"]],
  ["時江さん", "Tokie-san", ["Tokie"]],
  // Last names
  ["三澤さん", "Misawa-san", ["Misawa"]],
  ["叶さん", "Kanou-san", ["Kanou"]],
  ["進藤さん", "Shindou-san", ["Shindou"]],
  ["沢木さん", "Sawaki-san", ["Sawaki"]],
  ["志田さん", "Shida-san", ["Shida"]],
  ["南さん", "Minami-san", ["Minami"]],
];
const KUN_LIST = [
  ["隆司君", "Takashi-kun", ["Takashi"]],
  ["拓也君", "Takuya-kun", ["Takuya"]],
  ["南君", "Minami-kun", ["Minami"]],
  [
    "タッ君",
    "Tak-kun",
    ["Takkun", "Taku-kun", "Takuya-kun", "Ta-kun", "Takuya"],
  ],
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

    let isCancelled = false;
    let isEdited = false;
    for (let i = 0; i < originalFileLines.length; i++) {
      const originalLine = originalFileLines[i];
      let translatedLine = translatedFileLines[i];

      // Name suffixes check
      for (const chanEntries of CHAN_LIST) {
        if (
          originalLine.includes(chanEntries[0]) &&
          !translatedLine.includes(chanEntries[1])
        ) {
          console.log(
            translatedFileName,
            i + 1,
            chanEntries,
            originalLine,
            translatedLine
          );
          let editable = false;
          for (const name of chanEntries[2]) {
            if (translatedLine.includes(name)) {
              editable = true;
              break;
            }
          }
          if (!editable) {
            continue;
          }
          const response = await prompts({
            type: "confirm",
            name: "value",
            message: "Should we update?",
          });
          if (response == null || Object.keys(response).length === 0) {
            isCancelled = true;
            break;
          }
          if (response.value) {
            isEdited = true;
            for (const name of chanEntries[2]) {
              translatedLine = translatedLine.replaceAll(name, chanEntries[1]);
            }
          }
        }
      }
      if (isCancelled) {
        process.exit();
      }

      for (const sanEntries of SAN_LIST) {
        if (
          originalLine.includes(sanEntries[0]) &&
          !translatedLine.includes(sanEntries[1])
        ) {
          console.log(
            translatedFileName,
            i + 1,
            sanEntries,
            originalLine,
            translatedLine
          );
          let editable = false;
          for (const name of sanEntries[2]) {
            if (translatedLine.includes(name)) {
              editable = true;
              break;
            }
          }
          if (!editable) {
            continue;
          }
          const response = await prompts({
            type: "confirm",
            name: "value",
            message: "Should we update?",
          });
          if (response == null || Object.keys(response).length === 0) {
            isCancelled = true;
            break;
          }
          if (response.value) {
            isEdited = true;
            for (const name of sanEntries[2]) {
              translatedLine = translatedLine.replaceAll(name, sanEntries[1]);
            }
          }
        }
      }
      if (isCancelled) {
        process.exit();
      }

      for (const kunEntries of KUN_LIST) {
        if (
          originalLine.includes(kunEntries[0]) &&
          !translatedLine.includes(kunEntries[1])
        ) {
          console.log(
            translatedFileName,
            i + 1,
            kunEntries,
            originalLine,
            translatedLine
          );
          let editable = false;
          for (const name of kunEntries[2]) {
            if (translatedLine.includes(name)) {
              editable = true;
              break;
            }
          }
          if (!editable) {
            continue;
          }
          const response = await prompts({
            type: "confirm",
            name: "value",
            message: "Should we update?",
          });
          if (response == null || Object.keys(response).length === 0) {
            isCancelled = true;
            break;
          }
          if (response.value) {
            isEdited = true;
            for (const name of kunEntries[2]) {
              translatedLine = translatedLine.replaceAll(name, kunEntries[1]);
            }
          }
        }
      }
      if (isCancelled) {
        process.exit();
      }
      if (translatedFileLines[i] !== translatedLine) {
        translatedFileLines[i] = translatedLine;
      }
    }
    if (isEdited) {
      console.log("FILE CHANGED", translatedFileName);
      await fsPromise.writeFile(
        translatedFilePath,
        translatedFileLines.join("\n")
      );
    }
  }
})();
