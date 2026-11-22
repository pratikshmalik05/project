# ⚡ Username Generator with Specified Length

A configurable username generator in Node.js that produces usernames of an **exact specified character length** (from 3 to 30 characters), styled and transformed using the [**`string-toolkit-simple-pratiksh`**](https://www.npmjs.com/package/string-toolkit-simple-pratiksh) npm package.

---

## ✨ Features

- 🎯 **Exact Length Guarantee**: Every generated username strictly matches your requested character count (e.g., 6, 8, 10, 15, 20).
- 🛠️ **Powered by `string-toolkit-simple-pratiksh`**: Utilizes package functions including:
  - `toCamelCase(text)`: Converts multi-word themes to clean camelCase handles (`cyberWolf`)
  - `toSnakeCase(text)`: Formats usernames in snake_case (`cyber_wolf`)
  - `toKebabCase(text)`: Formats usernames in kebab-case (`cyber-wolf`)
  - `capitalize(text)` & `capitalizeWords(text)`: Formats words and PascalCase handles (`CyberWolf`)
  - `truncate(text, length, suffix)`: Safely trims overflow to achieve exact target length
  - `slugify(text)`: Sanitizes custom seed keywords and strips invalid characters
  - `removeExtraSpaces(text)` & `isBlank(text)`: Validates and cleans user input
- 🎨 **Multiple Formatting Styles**:
  - `camelCase` (e.g., `frostBlade8`)
  - `snake_case` (e.g., `frost_blade`)
  - `kebab-case` (e.g., `frost-blade`)
  - `PascalCase` (e.g., `FrostBlade`)
  - `lowercase` (e.g., `frostblade`)
  - `uppercase` (e.g., `FROSTBLADE`)
- 🎲 **Themed Categories**: General, Gaming/Esports, Tech/Developer.
- 🔤 **Custom Seed/Keywords**: Pass your own base name or keyword, and the generator completes it to your target length.
- 💻 **Multiple Interfaces**:
  - **Programmatic API** (`require("./index")`)
  - **Interactive CLI** (`npm run cli`)
  - **Modern Web UI & REST API** (`npm start`)

---

## 🚀 Quick Start

### 1. Installation

```bash
# Clone or navigate to the project directory
cd /Users/pratikshmalik/project

# Install dependencies (includes string-toolkit-simple-pratiksh)
npm install
```

### 2. Run the CLI

Generate 5 usernames of exact length 10:
```bash
npm run cli -- --length 10 --count 5
```

Custom length and style:
```bash
npm run cli -- --length 12 --style snake_case --category tech
```

With a custom seed keyword:
```bash
npm run cli -- --length 8 --seed alex --style kebab-case
```

Interactive mode:
```bash
npm run cli -- --interactive
```

---

## 🌐 Web Interface & REST API

Start the local server:
```bash
npm start
```
Open **`http://localhost:3000`** in your browser to access the interactive web generator with live length slider, style selectors, and 1-click clipboard copy.

### API Endpoint

```http
GET /api/generate?length=10&count=5&style=camelCase&category=tech
```

**Sample Response:**
```json
{
  "success": true,
  "count": 5,
  "length": 10,
  "usernames": [
    "byteMatrix",
    "cyberCache",
    "proxyLaser",
    "alphaStack",
    "routerNode"
  ]
}
```

---

## 📦 Programmatic Usage

```javascript
const { generateUsername, generateUsernames, toolkit } = require("username-generator-specified-length");

// Generate a single username of exact length 8
const username = generateUsername({
  length: 8,
  style: "camelCase", // 'camelCase' | 'snake_case' | 'kebab-case' | 'pascal' | 'lowercase' | 'uppercase'
  category: "gaming", // 'all' | 'gaming' | 'tech'
  seed: "rex",        // optional keyword
  includeNumbers: true
});

console.log(username); // e.g. "rexFox88"
console.log(username.length); // 8

// Generate a batch of unique usernames
const batch = generateUsernames({ length: 12, style: "kebab-case" }, 5);
console.log(batch);
// [
//   "mighty-cobra",
//   "valiant-lion",
//   "solar-knight",
//   "cyber-dragon",
//   "shadow-blade"
// ]

// Direct access to string-toolkit-simple-pratiksh utilities
console.log(toolkit.capitalize("tiger")); // "Tiger"
console.log(toolkit.truncate("longusername", 8, "")); // "longuser"
```

---

## 🧪 Testing

Run the automated test suite:
```bash
npm test
```

This verifies that:
- Usernames across lengths 3 through 30 match the exact requested length.
- Formatting styles (`camelCase`, `snake_case`, `kebab-case`, etc.) are applied correctly.
- Seed keywords are properly integrated and sanitized.
- Batch uniqueness and fallback guarantees pass.
- `string-toolkit-simple-pratiksh` helper functions operate as expected.

---

## 📂 Project Structure

```
.
├── index.js             # Main package entry point
├── package.json         # Package configuration & scripts
├── README.md            # Documentation
├── src/
│   ├── generator.js     # Core username generation engine & length enforcement
│   ├── cli.js           # CLI interface with flags and interactive prompt
│   └── wordLists.js     # Curated dictionaries for themes and word matching
├── public/
│   ├── index.html       # Web application UI
│   ├── style.css        # Modern cyber/dark themed styles
│   └── app.js           # Frontend interactivity & clipboard integration
├── server.js            # Node.js HTTP server & REST API
└── test/
    └── generator.test.js # Automated test suite
```

---

## 📄 License

MIT
