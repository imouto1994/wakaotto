const fsPromise = require("fs/promises");
const path = require("path");
const { glob } = require("glob");

const ALT_MAP = {
  a00f_m: [
    [21, ["ぴょんっ。", "*Bounce*..."], ["ぶるんっ。", "*Bounce*..."]],
    [23, ["ぴょんっ。", "*Bounce*..."], ["ぶるんっ。", "*Bounce*..."]],
    [26, ["ぴょんっ。", "*Bounce*..."], ["ぶるんっ。", "*Bounce*..."]],
    [29, ["ぴょんっ。", "*Bounce*..."], ["ぶるんっ。", "*Bounce*..."]],
    [31, ["ぴょんっ。", "*Bounce*..."], ["ぶるんっ。", "*Bounce*..."]],
    [83, ["ぴょんっ。", "*Bounce*..."], ["ぶるんっ。", "*Bounce*..."]],
  ],
  ev13b_m: [
    [
      4,
      [
        "それに前後の動きまで加わってきた。",
        "But then a slight friction was added.",
      ],
    ],
    [5],
    [
      143,
      [
        "千尋：「あ、あ～～～っ、壊れちゃうっ。」",
        `Chihiro: "Ah... Aaah... I'm going to break."`,
      ],
    ],
    [144, ["優作：「壊れちゃいな。」", `Yusaku: "Break, then."`]],
  ],
  ev31_m: [
    [15, ["パッチン！！", "*Slap*!!"], ["ぶるるんっ。", "*Bounce*..."]],
    [160, ["ぬちゅっ…ぬちゅっ…ぬちゅっ…。", "*Squelch*..."]],
    [164, ["ぬちゅっ…ぬちゅっ…ぬちゃっ…ぬちゅっ…。", "*Squelch*..."]],
    [176, ["ぬちょっ…ぬぷっ…ぬちゃっ…ぬぷっ…ぬぷっ…。", "*Squelch*..."]],
    [184, ["ぬぷっ…ぐちゅっ…ぬぷっ…ぶるんっ…。", "*Squelch*..."]],
    [210, ["ぬちゅっ…ぬちゅっ…ぶるんっ…。", "*Squelch*..."]],
    [215, ["ぬちゃっ…ぬちゃっ…ぬちゃっ…ぬぷっ…。", "*Squelch*..."]],
  ],
  ev34c_m: [
    [
      17,
      [
        "エロ役人：「うはっ…むはっ…い、いいよ…もっと、早く…っ…。」",
        `Perverted Official: "Uhaa... muhaa... it's good... faster..."`,
      ],
    ],
    [23],
    [24],
    [25],
    [26],
    [27],
    [28],
    [29],
    [30],
    [31],
    [32],
    [33],
    [34],
    [35],
    [36],
    [37],
    [38],
    [39],
    [40],
    [41],
    [42],
  ],
  ev39a_00_m: [[1]],
  ev44b_00_m: [
    [
      17,
      [
        "入り口だって思いっきり拡げられて…。",
        "Even the entrance is being stretched wide open...",
      ],
      ["ぬぷっ…。", "*Squelch*..."],
    ],
  ],
  ev44b_01_m: [[57, ["ずりゅっ…。", "*Rub*..."]]],
  ev47_m: [
    [1, ["ぬぷ…ぅ…。", "*Rub*..."]],
    [78, ["ぬぷ…。", "*Rub*..."]],
    [81, ["ぬぷっ…ずっ…。", "*Rub*..."]],
    [81, ["ぬぷっ…ずっ…。", "*Rub*..."]],
    [
      83,
      [
        "優作：「さっきより深く入ってるような？」",
        `Yusaku: "Does it feel like it's going in deeper than before?"`,
      ],
      ["ぬぷっ…ずぐっ…ぐっ…。", "*Rub*..."],
    ],
    [85, ["ずっ…ぬぷっ…ずっ…ぐりっ…。", "*Rub*..."]],
    [
      87,
      [
        "優作：「そりゃ大変だ。」",
        `Yusaku: "You can't support yourself anymore, huh? That must be tough."`,
      ],
      ["ずっ…ぐっ…ぬぷっ…ずりっ…ぐっ、ぐっ…ぅ…。", "*Rub*..."],
    ],
    [89, ["ずぐっ。", "*Rub*..."]],
    [111, ["ずっ…。", "*Rub*..."]],
    [196, ["ぬぷっ…。", "*Rub*..."]],
    [318, ["ぬぷっ…ぐちゅっ…。", "*Rub*..."]],
    [321, ["ぐちゅっ…ぐちゅっ…くりっ…ぬぷっ…。", "*Squelch*..."]],
    [328, ["ぬぷっ…。", "*Rub*..."]],
    [333, ["ぬぷっ…ぐちゅ…。", "*Rub*..."]],
    [343, ["ぬぷっ…ぐちゅっ…ぬぷっ…ぬぷっ…ぬぷっ…。", "*Rub*..."]],
    [345, ["ぬぷっ…ぬぷっ…ぐちゅっ…ぬぷっ…ぬぷっ…ずりゅ…っ。", "*Rub*..."]],
  ],
  ev53b_01_m: [[34]],
  ev53b_02_m: [[1, ["ずりゅっっ…。", "*Rub*..."]]],
  ev53b_03_m: [[1, ["ぬちゅっ…。", "*Squelch*..."]]],
  ev54a_m: [[1], [2]],
  ev61c_m: [
    [
      119,
      ["優作：「なるほど。」", `Yusaku: "I see."`],
      ["ぬぷっ…。", "*Rub*..."],
      ["千尋：「ぁ…。」", `Chihiro: "Ah...ah..."`],
    ],
    [260, ["ぬぷっ…。", "*Rub*..."]],
    [476, ["ぬちゅっ…。", "*Rub*..."]],
  ],
};

const REVERSED_ALT_MAP = {};

(async () => {
  const translatedFilePaths = await glob("clean-final-json/*.json");
  const originalFilePaths = await glob("otto_json/*.json");
  translatedFilePaths.sort((s1, s2) => (s1 > s2) - (s1 < s2));
  originalFilePaths.sort((s1, s2) => (s1 > s2) - (s1 < s2));

  // Event files with `_m`
  for (const translatedFilePath of translatedFilePaths) {
    const [, translatedFileName] = translatedFilePath.split("/");
    const translatedFileNameWithoutExtension = translatedFileName.replace(
      ".json",
      ""
    );
    if (!translatedFileNameWithoutExtension.endsWith("_m")) {
      continue;
    }

    const edits = ALT_MAP[translatedFileNameWithoutExtension];
    if (edits == null) {
      console.log(`MISSING MAPPING for ${translatedFileNameWithoutExtension}`);
      return;
    }

    const editsMap = {};
    for (const [lineNumber, ...lines] of edits) {
      editsMap[`${lineNumber}`] = lines;
    }

    let outputLines = [];
    const fileContent = await fsPromise.readFile(translatedFilePath, {
      encoding: "utf-8",
    });
    const lines = JSON.parse(fileContent);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;
      if (editsMap[`${lineNumber}`] == null) {
        outputLines.push(line);
      } else {
        const updatedLines = editsMap[`${lineNumber}`];
        for (const updatedLine of updatedLines) {
          outputLines.push({ message: updatedLine[1] });
        }
      }
    }

    const altFilePath = translatedFilePath.replace("_m", "");
    await fsPromise.writeFile(
      altFilePath,
      JSON.stringify(outputLines, null, 2)
    );
  }

  // Event files without `_m`
  for (const translatedFilePath of translatedFilePaths) {
    const [, translatedFileName] = translatedFilePath.split("/");
    const translatedFileNameWithoutExtension = translatedFileName.replace(
      ".json",
      ""
    );
    if (
      !translatedFileNameWithoutExtension.startsWith("ev") ||
      translatedFileNameWithoutExtension.endsWith("_m")
    ) {
      continue;
    }

    const fileContent = await fsPromise.readFile(translatedFilePath, {
      encoding: "utf-8",
    });
    const lines = JSON.parse(fileContent);
    const altFilePath = translatedFilePath.replace(".json", "_m.json");
    await fsPromise.writeFile(altFilePath, JSON.stringify(lines, null, 2));
  }
})();
