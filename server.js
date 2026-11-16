// Minimal static file server for the Digian app (no dependencies).
// Usage:  node server.js            -> http://0.0.0.0:8080
//         set PORT=3000 & node server.js
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || "0.0.0.0"; // 0.0.0.0 = reachable from other devices

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

// Only these files/folders are served; server.js and anything else stay private.
const PUBLIC = ["index.html", "styles.css", "js"];

function send(res, status, body, type) {
  res.writeHead(status, {
    "Content-Type": type || "text/plain; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "same-origin"
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, "Method not allowed");

  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
  } catch {
    return send(res, 400, "Bad request");
  }
  if (urlPath === "/") urlPath = "/index.html";

  const file = path.normalize(path.join(ROOT, urlPath));
  const rel = path.relative(ROOT, file);
  const top = rel.split(path.sep)[0];

  // Block path traversal and anything not in the public list.
  if (rel.startsWith("..") || path.isAbsolute(rel) || !PUBLIC.includes(top)) return send(res, 404, "Not found");

  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) return send(res, 404, "Not found");
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Content-Length": stat.size,
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "Referrer-Policy": "same-origin"
    });
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(file).pipe(res);
  });
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Digian may already be running at http://localhost:${PORT}`);
    console.error(`Stop the other copy, or use another port:  set PORT=3000 & npm start`);
  } else {
    console.error("Server error:", err.message);
  }
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`Digian running on:`);
  console.log(`  Local:   http://localhost:${PORT}`);
  for (const nets of Object.values(os.networkInterfaces())) {
    for (const n of nets || []) {
      if (n.family === "IPv4" && !n.internal) console.log(`  Network: http://${n.address}:${PORT}`);
    }
  }
  console.log("Press Ctrl+C to stop.");
});
