import { CommandRouter } from "./cmd_router.js";

async function main() {
  const object = new CommandRouter();
  const args: string[] = process.argv;
  const success = await object.parseArgs(args);
  process.exit(success? 0: 1)
}

await main();
