#!/usr/bin/env node

import { CommandRouter } from "./cmd_router.js";


async function main() {
  const args: string[] = process.argv;
  const object = new CommandRouter();
  const success = await object.parseArgs(args);
  process.exit(success ? 0 : 1);
}

await main();
