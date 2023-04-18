const fsPromise = require("fs/promises");
const path = require("path");
const { glob } = require("glob");

const SPEAKER_MAP = {
  "南　拓也": "Minami Takuya",
  拓也: "Takuya",
  沙耶: "Saya",
  香織: "Kaori",
  乙葉: "Otoha",
  由紀: "Yuki",
  律子: "Ritsuko",
  隆司: "Takashi",
  松太郎: "Matsutarou",
  昭彦: "Akihiko",
  時江: "Tokie",
  三澤: "Misawa",
  進藤: "Shindou",
  沢木: "Sawaki",
  志田: "Shida",
  "＋＋＋": "＋＋＋",
  "＊＊": "＊＊",
  取調官: "Interrogator",
  "＊＊＊": "＊＊＊",
  "×××": "×××",
  "地方公務員、５５歳": "Local government worker, 55 years old",
  妻: "Wife",
  "▲▲▲": "▲▲▲",
  "■■■": "■■■",
  "○○○": "○○○",
  "◎◎◎": "◎◎◎",
  "◆◆◆": "◆◆◆",
  "△△△": "△△△",
  "◇◇◇": "◇◇◇",
  "●●●": "●●●",
};

const SPEAKER_LIST = [
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
  // Unknown
  ["＋＋＋", "＋＋＋"],
  ["＊＊", "＊＊"],
  ["取調官", "Interrogator"],
  ["＊＊＊", "＊＊＊"],
  ["×××", "×××"],
  ["地方公務員、５５歳", "Local government worker, 55 years old"],
  ["妻", "Wife"],
  ["▲▲▲", "▲▲▲"],
  ["■■■", "■■■"],
  ["○○○", "○○○"],
  ["◎◎◎", "◎◎◎"],
  ["◆◆◆", "◆◆◆"],
  ["△△△", "△△△"],
  ["◇◇◇", "◇◇◇"],
  ["●●●", "●●●"],
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
      const originalSpeakerMatches = originalLine.match(/^(.*):「.*$/);
      const translatedSpeakerMatches = translatedLine.match(/^(.*): ".*$/);
      if (originalSpeakerMatches == null || translatedSpeakerMatches == null) {
        continue;
      }
      const originalSpeaker = originalSpeakerMatches[1];
      const translatedSpeaker = translatedSpeakerMatches[1];

      if (SPEAKER_MAP[originalSpeaker] == null) {
        reviewRequired = true;
        console.log(i + 1, "UNDETECTED ORIGINAL SPEAKER", originalSpeaker);
      }
      if (SPEAKER_MAP[originalSpeaker] !== translatedSpeaker) {
        reviewRequired = true;
        console.log(
          i + 1,
          "MISMATCH SPEAKER",
          originalSpeaker,
          translatedSpeaker
        );
      }
    }
    if (reviewRequired) {
      console.log("FILE NAME:", translatedFileName);
      console.log("------------------------------------------------------");
    }
  }
})();
