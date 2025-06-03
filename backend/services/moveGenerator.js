const fs = require("fs");
const path = require("path");

function renderTemplate(template, data) {
  return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()]);
}

function generateMoveModule({
  name,
  symbol,
  description,
  image_url,
  decimals = 9,
  outputDir,
}) {
  const tokenLower = symbol.toLowerCase();
  const tokenUpper = symbol.toUpperCase();

  const moveTemplate = fs.readFileSync(
    path.join(__dirname, "../templates/user_coin.move"),
    "utf8"
  );
  const tomlTemplate = fs.readFileSync(
    path.join(__dirname, "../templates/Move.toml"),
    "utf8"
  );

  const moveContent = renderTemplate(moveTemplate, {
    name,
    symbol,
    description,
    image_url,
    decimals,
    tokenLower,
    tokenUpper,
  });

  const moveDir = path.join(outputDir, "user_coin/sources");
  fs.mkdirSync(moveDir, { recursive: true });

  fs.writeFileSync(path.join(moveDir, `${tokenLower}.move`), moveContent);
  fs.writeFileSync(path.join(outputDir, "user_coin/Move.toml"), tomlTemplate);

  return path.join(outputDir, "user_coin");
}

module.exports = { generateMoveModule };
