#!/usr/bin/env node
import inquirer from "inquirer";
import fs from "fs";
import path from "path";

const defaultSettings = {
  gridSystem: "8-point + 4-point baseline",
  baseFontSize: 16,
  contrastRatio: 1.2
};

// Helper to snap values to 4px multiples
const snap4px = (px) => Math.round(px / 4) * 4;

// CLI questions
const questions = [
  {
    type: "list",
    name: "gridSystem",
    message: "Choose your Grid System:",
    choices: ["8-point + 4-point baseline", "2x Grid"],
    default: defaultSettings.gridSystem
  },
  {
    type: "input",
    name: "baseFontSize",
    message: "Set Base Font Size (px):",
    default: defaultSettings.baseFontSize,
    validate: (input) => !isNaN(input) || "Please enter a number"
  },
  {
    type: "list",
    name: "contrastRatio",
    message: "Choose your Contrast Scale Ratio:",
    choices: [
      { name: "Minor Third (1.2)", value: 1.2 },
      { name: "Major Third (1.25)", value: 1.25 },
      { name: "Perfect Fourth (1.333)", value: 1.333 },
      { name: "Perfect Fifth (1.5)", value: 1.5 },
      { name: "Golden Ratio (1.618)", value: 1.618 }
    ],
    default: defaultSettings.contrastRatio
  }
];

async function runSetup() {
  const answers = await inquirer.prompt(questions);

  // Compute dynamic token values
  const { baseFontSize: base, contrastRatio: ratio, gridSystem } = answers;

  // Font sizes
  const fontSizes = {
    body: base,
    h3: snap4px(base * Math.pow(ratio, 1)),
    h2: snap4px(base * Math.pow(ratio, 2)),
    h1: snap4px(base * Math.pow(ratio, 3))
  };

  // Line heights (relative)
  const lineHeights = {
    body: snap4px(base * 1.5) / fontSizes.body,
    small: snap4px(base * 1.4) / (base * 0.875), // ~14px small text
    h3: snap4px(fontSizes.h3 * 1.3) / fontSizes.h3,
    h2: snap4px(fontSizes.h2 * 1.2) / fontSizes.h2,
    h1: snap4px(fontSizes.h1 * 1.2) / fontSizes.h1
  };

  // Spacing tokens (based on base font)
  const spacing = {
    xxs: snap4px(base * 0.75),
    xs: snap4px(base * 1),
    s: snap4px(base * 1),
    m: snap4px(base * 1.25),
    l: snap4px(base * 1.5),
    xl: snap4px(base * 1.75),
    xxl: snap4px(base * 2),
    xxxl: snap4px(base * 2.5)
  };

  // Container widths & gutters based on grid system
  const containers = gridSystem === "8-point + 4-point baseline" 
    ? { xs: "100%", sm: "540px", md: "720px", lg: "1040px", xl: "1320px" }
    : { xs: "100%", sm: "560px", md: "760px", lg: "1080px", xl: "1360px" };

  const gutters = gridSystem === "8-point + 4-point baseline" 
    ? { xs: "16px", sm: "24px", md: "24px", lg: "32px", xl: "32px" }
    : { xs: "16px", sm: "24px", md: "24px", lg: "32px", xl: "32px" }; // could vary for 2x grid if desired

  // Save token file
  const tokenFile = path.join(process.cwd(), "wireframe-ui-tokens.js");
  const content = `export const tokens = {
    gridSystem: "${gridSystem}",
    baseFontSize: ${base},
    contrastRatio: ${ratio},
    fontSizes: ${JSON.stringify(fontSizes, null, 2)},
    lineHeights: ${JSON.stringify(lineHeights, null, 2)},
    spacing: ${JSON.stringify(spacing, null, 2)},
    containers: ${JSON.stringify(containers, null, 2)},
    gutters: ${JSON.stringify(gutters, null, 2)}
  };`;

  fs.writeFileSync(tokenFile, content);
  console.log("\n✅ Wireframe UI token file generated: wireframe-ui-tokens.js");
}

runSetup();
