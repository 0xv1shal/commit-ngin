import chalk from "chalk";

export class UiManager {
  constructor() {}

  parseAndShowAiSuggestions(list: string[]) {
    if (!list || list.length === 0) {
      console.log(chalk.red("No AI suggestions available."));
      return;
    }

    console.log(chalk.bold.cyan("\n=== AI Commit Suggestions ===\n"));

    list.forEach((suggestion, index) => {
      console.log(chalk.bold.green(`Suggestion ${index + 1}:`));

      console.log(chalk.white(suggestion.trim()));

      if (index !== list.length - 1) {
        console.log(
          chalk.gray("\n---------------------------------------------\n")
        );
      }
    });

    console.log(
      chalk.bold.cyan("\n=============================================\n")
    );
  }

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
  ${chalk.green("--generate")}  generates commit suggestions
`);

    const box = `
${title}

${msg}${supported}
${chalk.gray("Run")} ${chalk.cyan("commit-ngin --help")} ${chalk.gray(
      "for detailed usage."
    )}
`;

    console.log(box);
  }

  printMoreThanOneArgsPassed() {
    console.log(
      chalk.red.bold("Error: ") +
        chalk.red("More than one argument was passed, but only one is allowed.")
    );

    console.log(
      chalk.yellow("Usage: ") +
        chalk.white("commit-ngin <optional-single-argument>")
    );

    console.log(chalk.gray("Hint: Remove extra arguments and try again."));
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
  ${chalk.cyan("--generate")}    generates commit suggestions
`)}

${center(chalk.gray("CommitNgin — Precision commits. Zero compromise."))}
`);
  }

  printGenerateCommands() {
    console.log(
      chalk.white(`
${chalk.cyan("------------------------------------------")}
${chalk.green("Enter 1 or 2 or 3 to commit")}
${chalk.blue("Press ENTER button to retry")}
${chalk.yellow("type anything for passing to ai for improvement")}
${chalk.red("type q to quit")}
${chalk.cyan("------------------------------------------")}
      `)
    );
  }
}
