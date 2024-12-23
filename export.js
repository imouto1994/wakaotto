const fsPromise = require("fs/promises");
const path = require("path");
const { glob } = require("glob");

(async () => {
  const translatedFilePaths = await glob("clean-final/*.txt");
  translatedFilePaths.sort((s1, s2) => (s1 > s2) - (s1 < s2));

  for (const translatedFilePath of translatedFilePaths) {
    const [, translatedFileName] = translatedFilePath.split("/");
    const exportedFilePath = `clean-final-json/${translatedFileName.replace(
      ".txt",
      ".json"
    )}`;
    const translatedFileContent = await fsPromise.readFile(translatedFilePath, {
      encoding: "utf-8",
    });
    const translatedFileLines = translatedFileContent.split("\n");
    const entries = [];
    for (const line of translatedFileLines) {
      const speakerMatch = line.match(/^.*: ".*$/);
      const validSpeakerMatch = line.match(/^(.*): "(.*)"$/);
      if (speakerMatch != null && validSpeakerMatch == null) {
        console.log("INVALID SPEAKER LINE", line);
        return;
      }

      entries.push({
        message: line,
      });
    }

    await fsPromise.writeFile(
      exportedFilePath,
      JSON.stringify(entries, null, 2)
    );
  }
})();
