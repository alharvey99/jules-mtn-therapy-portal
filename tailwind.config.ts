import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          bg: "var(--canvas-bg)",
          text: "var(--canvas-text)",
          muted: "var(--canvas-text-muted)"
        },
        panel: {
          bg: "var(--panel-bg)",
          border: "var(--panel-border)",
          text: "var(--panel-text)",
          muted: "var(--panel-text-muted)"
        },
        contrast: {
          bg: "var(--contrast-bg)",
          border: "var(--contrast-border)",
          text: "var(--contrast-text)",
          muted: "var(--contrast-text-muted)"
        },
        action: {
          primary: "var(--action-primary-bg)",
          "primary-hover": "var(--action-primary-bg-hover)",
          "primary-text": "var(--action-primary-text)",
          secondary: "var(--action-secondary-bg)",
          "secondary-border": "var(--action-secondary-border)",
          "secondary-text": "var(--action-secondary-text)",
          ghost: "var(--action-ghost-text)"
        },
        state: {
          success: "var(--state-success-bg)",
          "success-text": "var(--state-success-text)",
          danger: "var(--state-danger-bg)",
          "danger-text": "var(--state-danger-text)",
          warning: "var(--state-warning-bg)",
          "warning-text": "var(--state-warning-text)",
          info: "var(--state-info-bg)",
          "info-text": "var(--state-info-text)"
        }
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "18px",
        pill: "9999px"
      },
      boxShadow: {
        sm: "0 1px 2px 0 var(--shadow-colour)",
        md: "0 4px 12px 0 var(--shadow-colour)",
        lg: "0 12px 24px 0 var(--shadow-colour)"
      }
    },
  },
  plugins: [],
};
export default config;
