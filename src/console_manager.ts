import chalk from "chalk";
import { FileManager } from "./file_manager.js";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { AiManager } from "./ai_manager.js";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { UiManager } from "./ui_manager.js";

export class ConsoleManager {
  #fileManager: FileManager;
  #rl: readline.Interface;
  #uiManager: UiManager;

  constructor() {
    this.#uiManager = new UiManager();
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
      const errMsg: string = `
  ${chalk.bgYellow.black.bold("  WARNING  ")}
  ${chalk.yellow("CommitNgin is already initialized in this project.")}
  
  ${chalk.gray("No changes were made.")}
  `;
      if (await this.#checkFileExistsWithPrinitngMessage(errMsg, true)) {
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

  async generateMsgs() {
    const errorMsg: string = `
${chalk.bgRed.white.bold("  ERROR  ")}
${chalk.yellow(
  "No data file was found please initalize commit-ngin before generating msgs."
)}
            
${chalk.gray("No changes were made.")}
            `;
    if (!(await this.#checkFileExistsWithPrinitngMessage(errorMsg, false))) {
      return;
    }
    const aiManager = new AiManager();

    const diffText = await this.#getFileDiffFromGit();

    if (diffText.trim() === "") {
      console.log(chalk.red("There's no file in staging"));
      return;
    }

    let result: string[] = await aiManager.askAi(diffText);
    this.#uiManager.parseAndShowAiSuggestions(result);
    this.#uiManager.printGenerateCommands();

    while (true) {
      const ans = await this.#rl.question("[INPUT]: ");
      if (ans === "1" || ans === "2" || ans === "3") {
        await this.#performCommit(result[Number(ans) - 1]);
        this.#rl.close();
        break;
      } else if (ans.trim() === "q") {
        console.log("THANKS FOR USING");
        this.#rl.close();
        break;
      } else if (ans.trim() === "") {
        result = await aiManager.askAi(
          "please retry based on previous messages"
        );
        this.#uiManager.parseAndShowAiSuggestions(result);
      } else {
        result = await aiManager.askAi(ans);
        this.#uiManager.parseAndShowAiSuggestions(result);
      }
    }
  }

  async #getFileDiffFromGit(): Promise<string> {
    let diffText = "";

    const diff = spawn("git", ["diff", "--staged"]);
    diff.stdout.on("data", async (data) => {
      diffText = data.toString();
    });

    diff.stderr.on("data", (data) => {
      throw new Error(data);
    });

    await once(diff, "close");

    return diffText;
  }

  async #performCommit(msg: string): Promise<void> {
    const cmdPerformer = spawn("git", ["commit", "-m", msg]);
    cmdPerformer.stderr.on("data", (data) => {
      console.log(chalk.bgRed.white("ERROR WHILE COMMITING"));
      console.log(chalk.bgWhite.yellow(data));
    });

    cmdPerformer.stdout.on("data", (data) => {
      console.log(data);
    });

    const [code] = await once(cmdPerformer, "close");
    if (code === 0) {
      await this.#fileManager.appendCommit(msg);
      console.log(chalk.bgWhite.green("SUCCESS !!!"));
      console.log(chalk.bgWhite.yellow("Thanks for using ⊂(◉‿◉)つ"));
    }
  }

  async #checkFileExistsWithPrinitngMessage(
    msg: string,
    whenToPrint: boolean
  ): Promise<boolean> {
    const result = await this.#fileManager.checkDataFileExists();
    if (result === whenToPrint) {
      console.log(msg);
    }

    return result;
  }
}
