module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#4F4D4D",
        info: "#3B82F6",
        inputBg: "rgba(255, 255, 255, 0.2);",
        error: "#EB5757",
        description: "#646464",
        item: "rgba(255, 255, 255, 0.6);",
      },
      backgroundImage: {
        bgCommon: "url('/bg-common.svg')",
        bgCommonSP: "url('/bg-common.svg')",
        bg404: "url('/bg-404.svg')",
        bgDetail: "url('/bg-detail.svg')",
        footerSP:
          "linear-gradient(125.53deg, rgba(0, 0, 0, 0) -63.23%, rgba(255, 255, 255, 0.8) 222.31%);",
        bgLinear:
          "linear-gradient(0deg, rgba(255, 255, 255, 0.5) -30.57%, rgba(178, 182, 242, 0) 93.83%);",
      },
      scale: {
        101: "1.01",
      },
      dropShadow: {
        footer: "0px 4px 49px rgba(0, 7, 72, 0.12)",
      },
      backgroundPosition: {
        left120: "136px 0",
        left60: "60px 0",
      },
      boxShadow: {
        footer: "0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 12px",
      },
    },
    fontFamily: {
      sans: ["Inter, sans-serif", { fontFeatureSettings: '"cv11", "ss01"' }],
    },
  },
  plugins: [],
};
