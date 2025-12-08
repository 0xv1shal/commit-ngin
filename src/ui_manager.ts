import chalk from "chalk";

export class UiManager {
  constructor() {}

  /**
   * Modern, clean UI for the "no args / unknown flag" error
   */
  printNoArgsErrorUI() {
    const title = chalk.bgRed.black.bold("  ERROR  ");
    const msg = chalk.redBright("Unknown or missing flag.\n");

    const supported = chalk.whiteBright(`
${chalk.gray("Supported Commands")}
  ${chalk.green("--init")}      Initialize CommitNgin in your project
  ${chalk.green("--help")}      Show help and usage guide
`);

    const box = `
${title}

${msg}${supported}
${chalk.gray("Run")} ${chalk.cyan("commitngin --help")} ${chalk.gray(
      "for detailed usage."
    )}
`;

    console.log(box);
  }

  printHelpUI() {
    const width = process.stdout.columns || 80;
    const center = (text: string) => text.padStart((width + text.length) / 2);

    // Legendary custom ASCII wordmark (COMMITNGIN)
    const logo = [
      "▄▄▄▄▄▄▄   ▄▄▄▄▄   ▄▄▄      ▄▄▄ ▄▄▄      ▄▄▄ ▄▄▄▄▄ ▄▄▄▄▄▄▄▄▄    ▄▄▄    ▄▄▄  ▄▄▄▄▄▄▄  ▄▄▄▄▄ ▄▄▄    ▄▄▄ ",
      "███▀▀▀▀▀ ▄███████▄ ████▄  ▄████ ████▄  ▄████  ███  ▀▀▀███▀▀▀    ████▄  ███ ███▀▀▀▀▀   ███  ████▄  ███ ",
      "███      ███   ███ ███▀████▀███ ███▀████▀███  ███     ███       ███▀██▄███ ███        ███  ███▀██▄███ ",
      "███      ███▄▄▄███ ███  ▀▀  ███ ███  ▀▀  ███  ███     ███ ▀▀▀▀▀ ███  ▀████ ███  ███▀  ███  ███  ▀████ ",
      "▀███████  ▀█████▀  ███      ███ ███      ███ ▄███▄    ███       ███    ███ ▀██████▀  ▄███▄ ███    ███ ",
    ]
      .map((line) => chalk.cyanBright.bold(center(line)))
      .join("\n");

    console.log(`
${logo}

${center(
  chalk.gray("AI-Enhanced • On-Premise • Developer-First Commit Engine")
)}

${chalk.magentaBright.bold("\n◆   What is CommitNgin?")}
${chalk.white(`
CommitNgin is your on-premise, AI-powered commit generator that blends 
speed, accuracy, and engineering discipline.

It stores your:
  - Project description
  - Optional commit template
  - All changed files
in: ${chalk.yellow("commit.ngin/data.json")}

This state becomes your "commit memory".  
Every new commit uses this memory + LangChain + ${chalk.magenta(
  "Groq models"
)} to produce 
high-quality, context-aware commit messages.
`)}

${chalk.magentaBright.bold("\n◆   How It Works (The CommitNgin Pipeline)")}
${chalk.white(`
  ⚠️  Before using CommitNgin:
     Run: ${chalk.cyan("git add .")}  (stage your changes)

  1. Detect project metadata + staged files
  2. Load commit memory from ${chalk.yellow("commit.ngin/data.json")}
  3. Validate context and prepare AI input
  4. Send structured prompt to Groq via LangChain
  5. Generate clean, atomic commit messages
  6. Output a deterministic, developer-grade commit message
`)}


${chalk.magentaBright.bold("\n◆   Supported Commands")}
${chalk.white(`
  ${chalk.cyan("--init")}        Initialize CommitNgin in your project
  ${chalk.cyan("--help")}        Show this legendary help menu
`)}

${center(chalk.gray("CommitNgin — Precision commits. Zero compromise."))}
`);
  }
}
