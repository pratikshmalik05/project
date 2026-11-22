const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const { generateUsernames } = require("./src/generator");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // API endpoint
  if (pathname === "/api/generate") {
    const { length, count, style, category, seed, includeNumbers } = parsedUrl.query;

    const options = {
      length: parseInt(length, 10) || 8,
      count: parseInt(count, 10) || 8,
      style: style || "camelCase",
      category: category || "all",
      seed: seed || "",
      includeNumbers: includeNumbers !== "false"
    };

    const usernames = generateUsernames(options, options.count);

    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    });
    res.end(JSON.stringify({ success: true, count: usernames.length, length: options.length, usernames }));
    return;
  }

  // Static file serving
  let filePath = path.join(PUBLIC_DIR, pathname === "/" ? "index.html" : pathname);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      return;
    }

    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "text/plain" });
    res.end(data);
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`⚡ Username Generator Server running at http://localhost:${PORT}`);
  });
}

module.exports = server;
