const fsPromise = require("fs/promises");
const path = require("path");
const { glob } = require("glob");

(async () => {
  const translatedFilePaths = await glob("clean-temp/*.txt");
  for (const translatedFilePath of translatedFilePaths) {
    const [, translatedFileName] = translatedFilePath.split("/");
    const cleanFileName = translatedFileName
      .substring(0, translatedFileName.indexOf("["))
      .trim();
    const cleanFilePath = `clean-final/${cleanFileName}`;

    const translatedFileContent = await fsPromise.readFile(translatedFilePath, {
      encoding: "utf-8",
    });
    const cleanTranslatedFileLines = translatedFileContent
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .filter((s) => !s.startsWith("TAN:") && !s.startsWith("TAN-kun:"));
    await fsPromise.writeFile(
      cleanFilePath,
      cleanTranslatedFileLines.join("\n")
    );
  }
})();
