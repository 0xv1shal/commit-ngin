import chalk from "chalk";
import * as fs from "node:fs/promises";

export class FileManager {
  log: any;
  #dataFilePath: string = "./.commit.ngin/data.json";
  #dirPath: string = "./.commit.ngin";
  constructor() {
    this.log = console.log;
  }

  async initalizeFiles(
    projectDesc: string,
    groqKey: string,
    commitTemplate?: string
  ) {
    try {
      await fs.mkdir(this.#dirPath, { recursive: true });

      await fs.writeFile(
        this.#dataFilePath,
        JSON.stringify({
          projectDesc,
          commitTemplate,
          groqKey,
          prevCommits: [],
        }),
        "utf-8"
      );
      console.log(chalk.green.bold("successfully initalized"));
      console.log(
        chalk.green.bold("please add .commit.ngin/ to your .gitignore file")
      );
    } catch (error) {
      throw error;
    }
  }

  async checkDataFileExists(): Promise<boolean> {
    try {
      await fs.access(this.#dataFilePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  async readDataFileAsync(): Promise<string> {
    try {
      return await fs.readFile(this.#dataFilePath, {
        encoding: "utf-8",
        flag: "r",
      });
    } catch (error) {
      throw error;
    }
  }

  async appendCommit(commitMsg: string): Promise<void> {
    const fileData: string = await this.readDataFileAsync();
    const parsedData = JSON.parse(fileData);
    parsedData.prevCommits.push(commitMsg);
    await fs.writeFile(this.#dataFilePath, JSON.stringify(parsedData), "utf-8");
  }
}
