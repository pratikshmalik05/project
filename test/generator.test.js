const assert = require("assert");
const { generateUsername, generateUsernames, applyStyle, toolkit } = require("../src/generator");

console.log("▶ Running tests for Username Generator with Specified Length...\n");

let passed = 0;
let total = 0;

function it(description, fn) {
  total++;
  try {
    fn();
    console.log(`  ✔ PASS: ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ✖ FAIL: ${description}`);
    console.error(err);
  }
}

// 1. Exact length tests across a spectrum of lengths
const testLengths = [3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20, 25, 30];

testLengths.forEach(len => {
  it(`Generates username of exact length ${len}`, () => {
    for (let i = 0; i < 5; i++) {
      const username = generateUsername({ length: len });
      assert.strictEqual(
        username.length,
        len,
        `Expected length ${len}, got "${username}" with length ${username.length}`
      );
    }
  });
});

// 2. Style tests
it("Applies camelCase style correctly", () => {
  const username = generateUsername({ length: 12, style: "camelCase" });
  assert.strictEqual(username.length, 12);
  assert.ok(!username.includes("-") && !username.includes("_"));
  assert.strictEqual(username[0], username[0].toLowerCase());
});

it("Applies snake_case style correctly", () => {
  const username = generateUsername({ length: 12, style: "snake_case" });
  assert.strictEqual(username.length, 12);
  assert.ok(!username.includes("-"));
});

it("Applies kebab-case style correctly", () => {
  const username = generateUsername({ length: 12, style: "kebab-case" });
  assert.strictEqual(username.length, 12);
  assert.ok(!username.includes("_"));
});

it("Applies uppercase style correctly", () => {
  const username = generateUsername({ length: 8, style: "uppercase" });
  assert.strictEqual(username.length, 8);
  assert.strictEqual(username, username.toUpperCase());
});

it("Applies lowercase style correctly", () => {
  const username = generateUsername({ length: 8, style: "lowercase" });
  assert.strictEqual(username.length, 8);
  assert.strictEqual(username, username.toLowerCase());
});

// 3. Seed tests
it("Incorporates custom seed and preserves target length", () => {
  const seed = "blade";
  const len = 10;
  const username = generateUsername({ seed, length: len, style: "camelCase" });
  assert.strictEqual(username.length, len);
  assert.ok(username.toLowerCase().includes("blade"));
});

it("Truncates seed gracefully if seed >= target length", () => {
  const seed = "supercalifragilistic";
  const len = 8;
  const username = generateUsername({ seed, length: len });
  assert.strictEqual(username.length, len);
});

// 4. Batch generation
it("Generates requested batch count of unique usernames of exact length", () => {
  const count = 10;
  const len = 11;
  const batch = generateUsernames({ length: len, style: "camelCase" }, count);
  assert.strictEqual(batch.length, count);
  batch.forEach(u => {
    assert.strictEqual(u.length, len);
  });
});

// 5. Package integration verification
it("Verifies direct string-toolkit-simple-pratiksh methods are functioning", () => {
  assert.strictEqual(toolkit.capitalize("tiger"), "Tiger");
  assert.strictEqual(toolkit.reverse("abc"), "cba");
  assert.strictEqual(toolkit.countWords("hello world"), 2);
  assert.strictEqual(toolkit.toCamelCase("fast runner"), "fastRunner");
  assert.strictEqual(toolkit.truncate("longusername", 6, ""), "longus");
  assert.strictEqual(toolkit.isBlank("   "), true);
});

console.log(`\n========================================`);
console.log(`Summary: ${passed} / ${total} tests passed.`);
console.log(`========================================\n`);

if (passed !== total) {
  process.exit(1);
}
