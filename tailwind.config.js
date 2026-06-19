/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./data/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"]
      },
      colors: {
        orange: "#FF6B00",
        ember: "#FF3D00",
        gold: "#FFB347",
        ink: "#0D0D0D",
        charcoal: "#151515",
        panel: "#151515",
        panel2: "#1F1F1F",
        panel3: "#282828"
      },
      borderRadius: {
        panel: "16px"
      },
      boxShadow: {
        glow: "0 18px 55px rgba(0,0,0,.55)",
        luxury: "0 30px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.08)",
        orange: "0 12px 34px rgba(255,107,0,.35)"
      },
      animation: {
        fadeIn: "fadeIn .35s ease both",
        slideIn: "slideIn .3s ease both",
        bounceSoft: "bounceSoft .7s infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        slideIn: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" }
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" }
        }
      }
    }
  },
  plugins: []
};
