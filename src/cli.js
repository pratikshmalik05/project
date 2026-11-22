#!/usr/bin/env node

const readline = require("readline");
const { generateUsernames } = require("./generator");

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  white: "\x1b[37m"
};

function printHelp() {
  console.log(`
${colors.bold}${colors.cyan}⚡ Username Generator with Specified Length${colors.reset}
${colors.dim}Powered by string-toolkit-simple-pratiksh${colors.reset}

${colors.bold}Usage:${colors.reset}
  node src/cli.js [options]

${colors.bold}Options:${colors.reset}
  -l, --length <number>     Exact length of username (3-30, default: 8)
  -c, --count <number>      Number of usernames to generate (1-50, default: 5)
  -s, --style <type>        camelCase | snake_case | kebab-case | pascal | lowercase | uppercase (default: camelCase)
  --category <name>         all | tech | gaming (default: all)
  --seed <word>             Include custom seed/keyword
  --no-numbers              Do not pad with numbers
  -i, --interactive         Run in interactive prompt mode
  -h, --help                Show help menu

${colors.bold}Examples:${colors.reset}
  node src/cli.js --length 10 --count 5
  node src/cli.js -l 12 -s snake_case --category tech
  node src/cli.js -l 8 --seed alex -s kebab-case
`);
}

function parseArgs(args) {
  const options = {
    length: 8,
    count: 5,
    style: "camelCase",
    category: "all",
    seed: "",
    includeNumbers: true,
    interactive: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "-h" || arg === "--help") {
      printHelp();
      process.exit(0);
    } else if (arg === "-i" || arg === "--interactive") {
      options.interactive = true;
    } else if (arg === "-l" || arg === "--length") {
      options.length = parseInt(args[++i], 10);
    } else if (arg === "-c" || arg === "--count") {
      options.count = parseInt(args[++i], 10);
    } else if (arg === "-s" || arg === "--style") {
      options.style = args[++i];
    } else if (arg === "--category") {
      options.category = args[++i];
    } else if (arg === "--seed") {
      options.seed = args[++i];
    } else if (arg === "--no-numbers") {
      options.includeNumbers = false;
    }
  }

  return options;
}

function displayResults(usernames, options) {
  console.log(`\n${colors.bold}${colors.green}✔ Generated ${usernames.length} username(s) of exact length ${options.length}:${colors.reset}\n`);

  usernames.forEach((name, idx) => {
    const num = String(idx + 1).padStart(2, " ");
    console.log(`  ${colors.dim}${num}.${colors.reset} ${colors.bold}${colors.cyan}${name}${colors.reset}  ${colors.dim}[${name.length} chars]${colors.reset}`);
  });

  console.log(`\n${colors.dim}Style: ${options.style} | Category: ${options.category} | Powered by string-toolkit-simple-pratiksh${colors.reset}\n`);
}

async function runInteractive() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (q) => new Promise((resolve) => rl.question(q, resolve));

  console.log(`\n${colors.bold}${colors.cyan}--- Interactive Username Generator ---${colors.reset}\n`);

  const lengthInput = await question(`${colors.yellow}Target Username Length (3-30) [default 8]: ${colors.reset}`);
  const length = parseInt(lengthInput, 10) || 8;

  const countInput = await question(`${colors.yellow}How many usernames to generate? [default 5]: ${colors.reset}`);
  const count = parseInt(countInput, 10) || 5;

  console.log(`Styles: 1) camelCase  2) snake_case  3) kebab-case  4) pascal  5) lowercase  6) uppercase`);
  const styleInput = await question(`${colors.yellow}Choose style (1-6) [default 1]: ${colors.reset}`);
  const styles = ["camelCase", "snake_case", "kebab-case", "pascal", "lowercase", "uppercase"];
  const styleIndex = parseInt(styleInput, 10) - 1;
  const style = styles[styleIndex] || "camelCase";

  console.log(`Categories: 1) all  2) tech  3) gaming`);
  const catInput = await question(`${colors.yellow}Choose category (1-3) [default 1]: ${colors.reset}`);
  const categories = ["all", "tech", "gaming"];
  const catIndex = parseInt(catInput, 10) - 1;
  const category = categories[catIndex] || "all";

  const seed = await question(`${colors.yellow}Custom keyword/seed (optional, press Enter to skip): ${colors.reset}`);

  rl.close();

  const options = {
    length,
    count,
    style,
    category,
    seed: seed.trim(),
    includeNumbers: true
  };

  const usernames = generateUsernames(options, count);
  displayResults(usernames, options);
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes("-i") || args.includes("--interactive")) {
    runInteractive();
    return;
  }

  const options = parseArgs(args);
  const usernames = generateUsernames(options, options.count);
  displayResults(usernames, options);
}

if (require.main === module) {
  main();
}

module.exports = { parseArgs, displayResults };
