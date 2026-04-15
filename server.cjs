const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const distDir = path.resolve(__dirname, "dist");
const port = Number(process.env.PORT || 3000);
const host = "0.0.0.0";

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const isSafePath = (resolvedPath) => {
  const relative = path.relative(distDir, resolvedPath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
};

const getContentType = (filePath) => MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";

const send = (res, statusCode, body, headers = {}) => {
  res.writeHead(statusCode, {
    "Cache-Control": "no-store, no-cache, must-revalidate",
    ...headers,
  });
  res.end(body);
};

const serveFile = async (res, filePath) => {
  const data = await fs.readFile(filePath);
  send(res, 200, data, {
    "Content-Type": getContentType(filePath),
    ...(path.basename(filePath) !== "index.html"
      ? { "Cache-Control": "public, max-age=31536000, immutable" }
      : {}),
  });
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    const method = (req.method || "GET").toUpperCase();

    if (method !== "GET" && method !== "HEAD") {
      return send(res, 405, "Method Not Allowed", { Allow: "GET, HEAD" });
    }

    if (url.pathname === "/health" || url.pathname === "/ready") {
      return send(
        res,
        200,
        JSON.stringify({ status: "ok" }),
        { "Content-Type": "application/json; charset=utf-8" }
      );
    }

    const decodedPath = decodeURIComponent(url.pathname);
    const requestedPath = path.resolve(distDir, `.${decodedPath}`);

    if (!isSafePath(requestedPath)) {
      return send(res, 403, "Forbidden");
    }

    try {
      const stats = await fs.stat(requestedPath);
      if (stats.isDirectory()) {
        const indexPath = path.join(requestedPath, "index.html");
        return serveFile(res, indexPath);
      }

      return serveFile(res, requestedPath);
    } catch {
      const shouldFallbackToApp = !path.extname(decodedPath);
      if (shouldFallbackToApp) {
        return serveFile(res, path.join(distDir, "index.html"));
      }

      return send(res, 404, "Not Found");
    }
  } catch (error) {
    console.error("Frontend static server error:", error);
    return send(res, 500, "Internal Server Error");
  }
});

server.listen(port, host, () => {
  console.log(`Frontend server listening on http://${host}:${port}`);
});
