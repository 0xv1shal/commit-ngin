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
    for (const arg of args) {
      switch (arg) {
        case "--init":
          await this.#consoleManager.initCommitNgin();
          return true;
        case "--help":
          this.#uiManager.printHelpUI();
          return true;
        default:
          continue;
      }
    }
    
    this.#uiManager.printNoArgsErrorUI();
    return false;
  }
}
