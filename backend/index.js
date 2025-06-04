const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { generateMoveModule } = require("./services/moveGenerator");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");

const app = express();
const PORT = 3002;

app.use(cors());
app.use(bodyParser.json());

app.post("/create-token", async (req, res) => {
  const { address, name, symbol, description, image_url } = req.body;

  if (!address || !name || !symbol) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const slug = symbol.toLowerCase();
  const outDir = path.join(__dirname, "projects", `${address}_${slug}`);

  try {
    fs.mkdirSync(outDir, { recursive: true });

    const projectPath = generateMoveModule({
      name,
      symbol,
      description,
      image_url,
      decimals: 9,
      outputDir: outDir,
    });

    const buildCmd = `sui move build --path ${projectPath}`;
    console.log(`⚙️ Running build: ${buildCmd}`);
    try {
      execSync(buildCmd, { stdio: "inherit" });
    } catch (buildErr) {
      console.error("❌ Move build failed:", buildErr.message);
      return res
        .status(500)
        .json({ error: "Move build failed", details: buildErr.message });
    }

    const modulesDir = path.join(
      projectPath,
      "build",
      "user_coin",
      "bytecode_modules"
    );
    if (!fs.existsSync(modulesDir)) {
      throw new Error("Compiled bytecode_modules directory not found");
    }
    const moduleFiles = fs.readdirSync(modulesDir);
    const modules = moduleFiles
      .filter((file) => file.endsWith(".mv"))
      .map((file) =>
        fs.readFileSync(path.join(modulesDir, file)).toString("base64")
      );

    const buildInfoPath = path.join(
      projectPath,
      "build",
      "user_coin",
      "BuildInfo.yaml"
    );
    if (!fs.existsSync(buildInfoPath)) {
      throw new Error("BuildInfo.yaml not found. Build may have failed.");
    }

    const metadataRaw = fs.readFileSync(buildInfoPath, "utf8");
    const metadata = yaml.load(metadataRaw);

    const addressMap =
      metadata?.compiled_package_info?.address_alias_instantiation || {};
    const skipAliases = new Set(["user_coin"]);

    const dependencies = Object.entries(addressMap)
      .filter(([alias, addr]) => {
        if (skipAliases.has(alias)) return false;
        if (typeof addr !== "string") return false;

        const cleanAddr = addr.replace(/^0x/, "").toLowerCase();
        return /^[0-9a-f]{64}$/.test(cleanAddr);
      })
      .map(([_, addr]) => `0x${addr.replace(/^0x/, "").toLowerCase()}`);

    console.log("✅ Final dependencies to publish with:", dependencies);

    return res.json({
      success: true,
      modules,
      dependencies,
      tokenType: `user_coin::${slug}::${symbol.toUpperCase()}`,
    });
  } catch (err) {
    console.error("Token creation failed:", err);
    return res
      .status(500)
      .json({ error: "Token build failed", details: err.message });
  }
});

app.post("/cleanup-token-dir", (req, res) => {
  const { address, symbol } = req.body;
  const slug = symbol.toLowerCase();
  const dir = path.join(__dirname, "projects", `${address}_${slug}`);

  try {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`🧹 Cleaned up ${dir}`);
    return res.json({ success: true });
  } catch (err) {
    console.error("Cleanup failed:", err);
    return res.status(500).json({ success: false, error: "Cleanup failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
