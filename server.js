// 簡易靜態伺服器:node server.js 後開 http://localhost:8347
const http = require("http"), fs = require("fs"), path = require("path");
const root = __dirname;
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const f = path.join(root, p);
  if (!f.startsWith(root)) { res.writeHead(403); res.end(); return; }
  fs.readFile(f, (err, data) => {
    if (err) { res.writeHead(404); res.end("404"); return; }
    res.writeHead(200, { "Content-Type": mime[path.extname(f)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(8347, () => console.log("山海匯聚網站啟動:http://localhost:8347"));
