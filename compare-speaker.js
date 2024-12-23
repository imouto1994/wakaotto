const fsPromise = require("fs/promises");
const path = require("path");
const { glob } = require("glob");

const SPEAKER_MAP = {
  優作: "Yusaku",
  千尋: "Chihiro",
  翔太: "Shota",
  私服警察官: "Police Officer",
  田辺: "Tanabe",
  "＊＊": "**",
  "＋＋": "++",
  警視庁捜査官: "Detective of the Metropolitan Police Department",
  若い警察官: "Young Police Officer",
  エロ役人: "Perverted Official",
  "座間　優作": "Yusaku Zama",
  "秋月　翔太": "Shota Akizuki",
  翔太と千尋: "Shota and Chihiro",
  料理の先生: "Cooking Teacher",
  受付: "Receptionist",
  男の産婦人科医: "Male Obstetrician",
  看護婦: "Nurse",
  ＡＶ女優: "AV Actress",
  先生: "Teacher",
  ハゲの中年男: "Bald Middle-aged Man",
  ハゲ斉藤: "Bald Saito",
  ヒゲの中年男: "Bearded Middle-aged Man",
  ヒゲの酒屋: "Bearded Liquor Store Owner",
  いきなりのデブ: "Random Chubby Man",
  デブな千尋ファン: "Chubby Chihiro Fan",
  新たな中年男: "New Middle-aged Man",
  さらに新たな中年男: "Yet Another New Middle-aged Man",
  また新たな中年男: "Yet Another New Middle-aged Man",
  管理人のオヤジ: "Building Manager",
  千尋の一ファン: "A Fan of Chihiro",
  "１階の坂本さん": "Mr. Sakamoto from the first floor",
  クリーニング屋: "Dry Cleaner",
};

(async () => {
  const translatedFilePaths = await glob("clean-final/*.txt");
  translatedFilePaths.sort((s1, s2) => (s1 > s2) - (s1 < s2));
  for (const translatedFilePath of translatedFilePaths) {
    const [, translatedFileName] = translatedFilePath.split("/");
    const originalFilePath = `otto_output/${translatedFileName}`;

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

    let reviewRequired = false;
    for (let i = 0; i < originalFileLines.length; i++) {
      const originalLine = originalFileLines[i];
      const translatedLine = translatedFileLines[i];
      console.log(i + 1, originalLine, translatedLine);

      if (translatedLine == null) {
        console.log(
          i + 1,
          "MISSING TRANSLATED LINE",
          originalLine,
          translatedLine
        );
        break;
      }

      const originalSpeakerMatches = originalLine.match(/^(.*)：「.*$/);
      const translatedSpeakerMatches = translatedLine.match(/^(.*): ".*$/);
      if (originalSpeakerMatches == null && translatedSpeakerMatches == null) {
        continue;
      }
      if (originalSpeakerMatches == null || translatedSpeakerMatches == null) {
        reviewRequired = true;
        console.log(i + 1, "MISMATCHED");
        break;
      }
      const originalSpeaker = originalSpeakerMatches[1];
      const translatedSpeaker = translatedSpeakerMatches[1];

      if (SPEAKER_MAP[originalSpeaker] == null) {
        reviewRequired = true;
        console.log(i + 1, "UNDETECTED ORIGINAL SPEAKER", originalSpeaker);
        break;
      }
      if (SPEAKER_MAP[originalSpeaker] !== translatedSpeaker) {
        reviewRequired = true;
        console.log(
          i + 1,
          "MISMATCH SPEAKER",
          originalSpeaker,
          translatedSpeaker
        );
        break;
      }
    }

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

    if (reviewRequired) {
      console.log("FILE NAME:", translatedFileName);
      console.log("------------------------------------------------------");
      break;
    }
  }
})();
