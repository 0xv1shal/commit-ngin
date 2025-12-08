import chalk from "chalk";
import { FileManager } from "./file_manager.js";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export class ConsoleManager {
  
  #fileManager: FileManager;
  #rl: readline.Interface;

  constructor() {
    this.#fileManager = new FileManager();
    this.#rl = readline.createInterface({ input, output });
  }

  async #askInitalizationQuestions(): Promise<Record<string, string>> {
    let projectDesc: string = "";
    let commitTemplate: string = "";
    let groqKey: string = "";

    while (projectDesc.trim() === "") {
      projectDesc = await this.#rl.question(
        "Describe project summary (required) : "
      );
    }

    commitTemplate = await this.#rl.question("Commit template (optional) : ");

    while (groqKey.trim() === "") {
      groqKey = await this.#rl.question("Provide groq key (required) : ");
    }

    this.#rl.close();
    return {
      projectDesc,
      commitTemplate,
      groqKey,
    };
  }

  async initCommitNgin() {
    try {
      if (await this.#fileManager.checkDataFileExists()) {
        console.log(
          `
  ${chalk.bgYellow.black.bold("  WARNING  ")}
  ${chalk.yellow("CommitNgin is already initialized in this project.")}
  
  ${chalk.gray("No changes were made.")}
  `
        );
        return;
      }

      const data = await this.#askInitalizationQuestions();
      await this.#fileManager.initalizeFiles(
        data.projectDesc,
        data.groqKey,
        data.commitTemplate
      );
    } catch (error) {
      throw error;
    }
  }
}
