// src/tailwind/tailwind.config.js
import { tokens } from "../../wireframe-ui-tokens.js";

const snapToRem = (px) => `${px / 16}rem`;

export default {
  theme: {
    extend: {
      fontSize: {
        body: [snapToRem(tokens.fontSizes.body), { lineHeight: tokens.lineHeights.body }],
        h3: [snapToRem(tokens.fontSizes.h3), { lineHeight: tokens.lineHeights.h3 }],
        h2: [snapToRem(tokens.fontSizes.h2), { lineHeight: tokens.lineHeights.h2 }],
        h1: [snapToRem(tokens.fontSizes.h1), { lineHeight: tokens.lineHeights.h1 }]
      },
      spacing: Object.fromEntries(
        Object.entries(tokens.spacing).map(([k, v]) => [k, snapToRem(v)])
      ),
      container: {
        center: true,
        screens: tokens.containers
      },
      screens: {
        sm: tokens.containers.sm,
        md: tokens.containers.md,
        lg: tokens.containers.lg,
        xl: tokens.containers.xl
      }
    }
  }
};
