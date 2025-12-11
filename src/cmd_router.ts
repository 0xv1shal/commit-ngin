import { ConsoleManager } from "./console_manager.js";
import { UiManager } from "./ui_manager.js";

export class CommandRouter {
  #uiManager: UiManager;
  #consoleManager: ConsoleManager;

  constructor() {
    this.#uiManager = new UiManager();
    this.#consoleManager = new ConsoleManager();
  }

  async parseArgs(args: string[]): Promise<boolean> {
    if (args.length !== 3) {
      this.#uiManager.printMoreThanOneArgsPassed();
      return false;
    }

    const arg = args.at(-1);

    switch (arg) {
      case "--init":
        await this.#consoleManager.initCommitNgin();
        return true;
      case "--help":
        this.#uiManager.printHelpUI();
        return true;
      case "--generate":
        await this.#consoleManager.generateMsgs();
        return true;
      default:
    }

    this.#uiManager.printNoArgsErrorUI();
    return false;
  }
}
