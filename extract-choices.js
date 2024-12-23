const fsPromise = require("fs/promises");
const path = require("path");
const { glob } = require("glob");
const Encoding = require("encoding-japanese");

// Extract all CHOICE lines from game script
(async () => {
  const gameScriptFilePaths = await glob("game-script/*.txt");
  gameScriptFilePaths.sort((s1, s2) => (s1 < s2) - (s1 > s2));
  for (const gameScriptFilePath of gameScriptFilePaths) {
    const [, gameScriptFileName] = gameScriptFilePath.split("/");
    const sjisBuffer = await fsPromise.readFile(gameScriptFilePath);
    const unicodeArray = Encoding.convert(sjisBuffer, {
      to: "UNICODE",
      from: "SJIS",
    });
    const gameScriptFileContent = Encoding.codeToString(unicodeArray);
    const commandLines = gameScriptFileContent
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const choices = [];
    for (let i = 0; i < commandLines.length; i++) {
      const commandLine = commandLines[i];
      if (commandLine === "#1-CHOICE") {
        const selectionLine = commandLines[i + 3];
        const matches = selectionLine.match(/\[\"(.*)\"\]/);
        if (matches != null) {
          choices.push(matches[1]);
        }
      }
    }
    if (choices.length > 0) {
      const choiceScriptPath = `choices/${gameScriptFileName}.json`;
      await fsPromise.writeFile(
        choiceScriptPath,
        JSON.stringify(choices, null, 2)
      );
    }
  }
})();
