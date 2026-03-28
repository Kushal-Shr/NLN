import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stealth: {
          bg: "#0f1720",
          card: "#1b2a35",
          accent: "#0d9488",
          text: "#dce4ea",
          muted: "#93a4b2",
        },
      },
    },
  },
  plugins: [],
};

export default config;
