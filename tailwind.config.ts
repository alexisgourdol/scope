import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
        head: ['"DM Sans"', "sans-serif"],
      },
      borderRadius: {
        sm:   "var(--radius-sm)",
        md:   "var(--radius-md)",
        btn:  "var(--radius-btn)",
        lg:   "var(--radius-card)",
        xl:   "var(--radius-lg)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        card:        "var(--shadow-card)",
        "card-dark": "var(--shadow-card-dark)",
        cta:         "var(--shadow-cta)",
        "cta-hover": "var(--shadow-cta-hover)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          hover: "var(--accent-hover)",
          subtle: "var(--accent-subtle)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        "surface-invert": {
          DEFAULT: "var(--surface-invert)",
          foreground: "var(--surface-invert-text)",
        },
        status: {
          backlog:  "var(--status-backlog)",
          todo:     "var(--status-todo)",
          progress: "var(--status-progress)",
          done:     "var(--status-done)",
        },
        priority: {
          none:    "var(--priority-none)",
          low:     "var(--priority-low)",
          medium:  "var(--priority-medium)",
          high:    "var(--priority-high)",
          urgent:  "var(--priority-urgent)",
        },
      },
    },
  },
  plugins: [animate, typography],
};

export default config;
