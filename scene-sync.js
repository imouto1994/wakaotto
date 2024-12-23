const fsPromise = require("fs/promises");
const path = require("path");
const { glob } = require("glob");

const SCENE_MAP = {};

(async () => {
  const sceneFilePaths = await glob("otto_scene_json/scene*.json");
  const mainFilePaths = await glob("otto_json/*.json");
  sceneFilePaths.sort((s1, s2) => (s1 > s2) - (s1 < s2));
  mainFilePaths.sort((s1, s2) => (s1 > s2) - (s1 < s2));

  for (const sceneFilePath of sceneFilePaths) {
    const [, sceneFileName] = sceneFilePath.split("/");
    const sceneFileNameWithoutExtension = sceneFileName.replace(".json", "");
    const translatedSceneFilePath = `clean-final-scene-json/${sceneFileName}`;

    const chunks = SCENE_MAP[sceneFileNameWithoutExtension];
    if (chunks) {
      const entries = [];

      for (const {
        file,
        index: [startIndex, endIndex],
      } of chunks) {
        const fileContent = await fsPromise.readFile(
          `clean-final-json/${file}`,
          {
            encoding: "utf-8",
          }
        );
        const lines = JSON.parse(fileContent);
        for (let i = startIndex; i <= endIndex; i++) {
          entries.push(lines[i]);
        }
      }

      await fsPromise.writeFile(
        translatedSceneFilePath,
        JSON.stringify(entries, null, 2)
      );
    } else {
      const entries = [];
      const sceneJsonFileContent = await fsPromise.readFile(sceneFilePath, {
        encoding: "utf-8",
      });
      const sceneEntries = JSON.parse(sceneJsonFileContent);
      let hasMatch = false;

      for (const mainFilePath of mainFilePaths) {
        const indices = [];
        const mainJsonFileContent = await fsPromise.readFile(mainFilePath, {
          encoding: "utf-8",
        });
        const mainEntries = JSON.parse(mainJsonFileContent);

        let isMatched = true;
        let mainIndex = 0;
        for (let i = 0; i < sceneEntries.length; i++) {
          if (mainIndex >= mainEntries.length) {
            isMatched = false;
            break;
          }

          while (sceneEntries[i].message !== mainEntries[mainIndex].message) {
            mainIndex++;
            if (mainIndex >= mainEntries.length) {
              isMatched = false;
              break;
            }
          }
          if (!isMatched) {
            break;
          }
          indices.push(mainIndex);
          mainIndex++;
        }

        if (isMatched) {
          hasMatch = true;
          console.log("SCENE", sceneFilePath, "MAIN", mainFilePath);
          const fileContent = await fsPromise.readFile(
            mainFilePath.replace("otto_json/", "clean-final-json/"),
            {
              encoding: "utf-8",
            }
          );
          const lines = JSON.parse(fileContent);
          for (const index of indices) {
            entries.push(lines[index]);
          }
          await fsPromise.writeFile(
            translatedSceneFilePath,
            JSON.stringify(entries, null, 2)
          );
          break;
        }
      }

      if (!hasMatch) {
        console.log("------NO MATCH------", sceneFilePath);
      }
    }
  }
})();
