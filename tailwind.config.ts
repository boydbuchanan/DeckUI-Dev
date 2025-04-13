/* eslint-disable prettier/prettier */
import type { Config } from "tailwindcss";

import { tailwindConfig } from "@deckai/deck-ui";
//import tailwindConfig from "./src/packages/deck-ui/config";

export default {
  content: [
    "./src/**/*.{ts,tsx}",
    './containers/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@deckai/deck-ui/dist/**/*.{js,mjs}",
  ],
  presets: [tailwindConfig],
  theme: {
    extend: {
      fontFamily: {
        gilroy: ["var(--font-gilroy)"],
      },
    },
  },
} satisfies Config;
