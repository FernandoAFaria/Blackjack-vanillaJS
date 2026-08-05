const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const modelPath = path.join(root, "src/model/dealer.model.js");
const appPath = path.join(root, "src/index.js");
const outputPath = path.join(root, "dist/bundle.js");

function build() {
  const model = fs.readFileSync(modelPath, "utf8").replace(/module\.exports = \{[^;]+;/, "");
  const app = fs.readFileSync(appPath, "utf8").replace(/const \{ BlackjackGame, scoreHand \} = require\([^;]+;/, "");
  const bundle = `"use strict";\n(function () {\n${model}\n${app}\n})();\n`;
  fs.writeFileSync(outputPath, bundle);
  console.log(`Built ${path.relative(root, outputPath)} (${Buffer.byteLength(bundle)} bytes).`);
}

build();
if (process.argv.includes("--watch")) {
  console.log("Watching src for changes. Press Ctrl+C to stop.");
  [modelPath, appPath].forEach(file => fs.watch(file, { persistent: true }, build));
}
