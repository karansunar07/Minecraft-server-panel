export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        panel: {
          bg: "var(--color-background)",
          card: "var(--color-card)",
          card2: "var(--color-card-secondary)",
          primary: "var(--color-primary)",
          danger: "var(--color-danger)",
          success: "var(--color-success)",
          muted: "var(--color-muted)"
        }
      },
      boxShadow: {
        panel: "0 18px 50px rgba(0,0,0,.28)"
      }
    }
  },
  plugins: []
};
